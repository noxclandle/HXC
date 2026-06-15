import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const conditions: any[] = [
      { handle_name: { equals: slug, mode: "insensitive" } }
    ];

    if (isUuid) {
      conditions.push({ id: slug });
    }

    // 1. Fetch User Data
    const user = await prisma.user.findFirst({
      where: {
        OR: conditions
      }
    });

    if (!user) {
      return new NextResponse("Identity not found", { status: 404 });
    }

    // 2. Fetch and Resize Image (Server-Side using Sharp)
    let photoBase64 = "";
    if (user.photo_url && user.photo_url !== "IMAGE_LARGE") {
      try {
        let arrayBuffer: ArrayBuffer;
        
        if (user.photo_url.startsWith("http")) {
          const res = await fetch(user.photo_url);
          if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
          arrayBuffer = await res.arrayBuffer();
        } else if (user.photo_url.startsWith("data:image/")) {
          const parts = user.photo_url.split(",");
          const base64Data = parts[1];
          const buffer = Buffer.from(base64Data, "base64");
          arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        } else {
            throw new Error("Invalid image format");
        }

        // Use sharp to resize and compress to JPEG format (max 300x300, 80% quality)
        // This guarantees the image is small enough (< 30KB) for iOS Contacts to accept.
        const inputBuffer = Buffer.from(arrayBuffer);
        const processedBuffer = await sharp(inputBuffer)
          .resize(300, 300, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        photoBase64 = processedBuffer.toString("base64");
        
      } catch (error) {
        console.error("Failed to process vCard image server-side:", error);
      }
    }

    // Extract profile info from ai_config or direct fields
    const aiConfig = user.ai_config as any || {};
    const profileData = aiConfig.profile || {};

    // 3. Construct vCard 3.0 String (Strict iOS Compliance)
    const CRLF = "\r\n";
    const name = user.name || "MEMBER";
    const reading = user.handle_name || "";
    const phone = user.phone || profileData.phone || "";
    const email = profileData.contact_email || user.email || "";
    const company = profileData.company || "";
    const title = profileData.title || "";

    let vcard = `BEGIN:VCARD${CRLF}`;
    vcard += `VERSION:3.0${CRLF}`;
    vcard += `N:${name};;;;${CRLF}`;
    vcard += `FN:${name}${CRLF}`;
    if (reading) vcard += `SORT-STRING:${reading}${CRLF}`;
    if (company) vcard += `ORG:${company}${CRLF}`;
    if (title) vcard += `TITLE:${title}${CRLF}`;
    if (phone) vcard += `TEL;TYPE=CELL,VOICE:${phone}${CRLF}`;
    if (email) vcard += `EMAIL;TYPE=WORK,INTERNET:${email}${CRLF}`;

    if (photoBase64) {
      // 厳密なLine Folding: 74文字（バイトではなく文字）ごとにCRLF + SPACE
      const foldedBase64 = photoBase64.match(/.{1,74}/g)?.join(`${CRLF} `) || photoBase64;
      vcard += `PHOTO;TYPE=JPEG;ENCODING=b:${foldedBase64}${CRLF}`;
    }

    vcard += `END:VCARD${CRLF}`;

    // 4. Return as File Attachment
    const response = new NextResponse(vcard);
    response.headers.set("Content-Type", "text/vcard; charset=utf-8");
    // UTF-8エンコーディングを指定してファイル名をセット
    const encodedFileName = encodeURIComponent(`${name}.vcf`);
    response.headers.set("Content-Disposition", `attachment; filename*=UTF-8''${encodedFileName}`);

    return response;

  } catch (error) {
    console.error("vCard generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
