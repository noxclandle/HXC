import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, handle, title, website, bio, company, photo_url, logo_url, orientation, phone, email: contactEmail, alignHeader, alignMain, alignFooter } = body;

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const currentEquipped = (currentUser?.equipped_assets as any) || {};

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name,
        handle_name: handle,
        link_website: website,
        photo_url: photo_url,
        logo_url: logo_url,
        phone: phone,
        equipped_assets: {
          ...currentEquipped,
          orientation: orientation,
          alignHeader: alignHeader || "center",
          alignMain: alignMain || "center",
          alignFooter: alignFooter || "center"
        },
        ai_config: {
          profile: {
            title: title,
            bio: bio,
            company: company,
            contact_email: contactEmail
          }
        }
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update identity." }, { status: 500 });
  }
}
