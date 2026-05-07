import { NextRequest, NextResponse } from "next/server";
import { getPublicProfile } from "@/lib/user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const profile = await getPublicProfile(params.slug);

    if (!profile) {
      return NextResponse.json({ error: "Identity not found." }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}
