import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Extract profile info from ai_config or direct fields
    const aiConfig = user.ai_config as any || {};
    const profileData = aiConfig.profile || {};

    // 2. Construct vCard 3.0 String (Strict iOS Compliance, NO IMAGES)
    const CRLF = "\r\n";
    const name = user.name || "MEMBER";
    const reading = user.handle_name || "";
    const phone = user.phone || profileData.phone || "";
    const email = profileData.contact_email || user.email || "";
    const company = profileData.company || "";
    const title = profileData.title || "";
    const website = user.link_website || profileData.website || `https://hxc.hexa-relation.com/p/${slug}`;

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
    vcard += `URL;type=HexaCard:https://hxc.hexa-relation.com/p/${slug}${CRLF}`;

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
