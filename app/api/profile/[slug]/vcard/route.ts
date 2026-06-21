import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = decodeURIComponent(params.slug);

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

    // Extract profile info from ai_config or direct fields
    const aiConfig = user.ai_config as any || {};
    const profileData = aiConfig.profile || {};

    // 2. Construct vCard 3.0 String with Embedded Profile Image Support
    const CRLF = "\r\n";
    const name = user.name || "MEMBER";
    const reading = user.handle_name || "";
    const phone = user.phone || profileData.phone || "";
    const email = profileData.contact_email || user.email || "";
    const company = profileData.company || "";
    const title = profileData.title || "";
    const website = user.link_website || profileData.website || `https://virtual-business-card.hexa-relation.com/p/${slug}`;

    // Fetch and encode profile photo in Base64 if available
    let photoSection = "";
    const photoUrl = user.photo_url;
    if (photoUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout limit

        let fetchUrl = photoUrl;
        if (photoUrl.startsWith("/")) {
          const baseUrl = process.env.NEXTAUTH_URL || `https://virtual-business-card.hexa-relation.com`;
          fetchUrl = `${baseUrl}${photoUrl}`;
        }

        const imageRes = await fetch(fetchUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (imageRes.ok) {
          const arrayBuffer = await imageRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Photo = buffer.toString("base64");
          const contentType = imageRes.headers.get("content-type") || "image/jpeg";
          const imageType = contentType.includes("png") ? "PNG" : "JPEG";

          // Line folding according to RFC 2426 (vCard 3.0) - max 75 chars per line
          // Continuation lines must start with a space character
          const photoLines = base64Photo.match(/.{1,72}/g) || [];
          photoSection = `PHOTO;TYPE=${imageType};ENCODING=b:`;
          photoLines.forEach((line) => {
            photoSection += `${CRLF} ${line}`;
          });
          photoSection += CRLF;
        }
      } catch (err: any) {
        console.error("Failed to embed profile photo in vCard:", err.message || err);
      }
    }

    let vcard = `BEGIN:VCARD${CRLF}`;
    vcard += `VERSION:3.0${CRLF}`;
    vcard += `N:${name};;;;${CRLF}`;
    vcard += `FN:${name}${CRLF}`;
    if (reading) vcard += `SORT-STRING:${reading}${CRLF}`;
    if (company) vcard += `ORG:${company}${CRLF}`;
    if (title) vcard += `TITLE:${title}${CRLF}`;
    if (phone) vcard += `TEL;TYPE=CELL,VOICE:${phone}${CRLF}`;
    if (email) vcard += `EMAIL;TYPE=WORK,INTERNET:${email}${CRLF}`;
    if (website) vcard += `URL:${website}${CRLF}`;
    // Link directly to the digital business card
    vcard += `URL;type=HexaCard:https://virtual-business-card.hexa-relation.com/p/${slug}${CRLF}`;
    
    // Add photo if successfully encoded
    if (photoSection) {
      vcard += photoSection;
    }

    vcard += `END:VCARD${CRLF}`;

    // 3. Return as File Attachment
    const response = new NextResponse(vcard);
    response.headers.set("Content-Type", "text/vcard; charset=utf-8");
    const encodedFileName = encodeURIComponent(`${name}.vcf`);
    response.headers.set("Content-Disposition", `attachment; filename*=UTF-8''${encodedFileName}`);

    return response;

  } catch (error: any) {
    console.error("vCard generation error:", error.message || error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
