import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { card: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMastermind = user.role === "mastermind" || 
                         user.name?.includes("福井") || 
                         user.email === "str1yf5x@gmail.com";
    
    // Mastermind (Go Fukui) gets everything unlocked
    const titles = isMastermind 
      ? ["ASSOCIATE", "Initiate", "Observer", "Collector", "Messenger", "Connector", "Void Voyager", "Strategist", "Tech Lead", "Headhunter", "Gilded Soul", "The Sovereign", "Mastermind", "Architect", "Chief Officer", "APEX"]
      : (Array.isArray(user.unlocked_titles) ? user.unlocked_titles : []);

    const ownedAssets = isMastermind
      ? ["Obsidian", "Gold", "Dynamic", "Sakura", "Emerald", "Platinum", "ImperialGold", "Default", "Carbon", "MonochromeGrid", "BrushedMetal", "Nebula", "SilkBlur", "Stardust", "RoyalGold", "MidnightMist", "DigitalFlow", "PrismFractal", "None", "Aethereal", "Glitch", "Interference", "Petals", "Pure White Hex", "Azure Trace", "Gold Trace", "Emerald Trace", "Violet Trace", "Crimson Trace", "resonance", "silver", "void"]
      : (Array.isArray(user.owned_assets) ? user.owned_assets : []);
    
    const assetPricesConfig = await prisma.systemConfig.findUnique({
      where: { key: 'asset_prices' }
    });
    const assetPrices = assetPricesConfig?.value || {};

    const aiConfig = (user.ai_config as any) || {};
    const profile = aiConfig.profile || {};
    const equipped = (user.equipped_assets as any) || {};

    const defaultAlign = {
      company: "center",
      title: "center",
      name: "center",
      reading: "center",
      phone: "center",
      email: "center"
    };

    return NextResponse.json({
      name: user.name || session.user.name || "ARCHITECT",
      rt_balance: user.rt_balance.toString(),
      exp: isMastermind ? "10000" : user.exp.toString(),
      rank: isMastermind ? "Mastermind" : user.rank,
      role: user.role,
      titles: titles,
      owned_assets: ownedAssets,
      asset_prices: assetPrices,
      uid: user.card?.uid || "NO CARD LINKED",
      handle: user.handle_name || "", 
      slug: user.handle_name || user.id,
      logo_url: user.logo_url || "",
      photo_url: user.photo_url || "",
      equipped: {
        ...equipped,
        frame: equipped.frame || "Obsidian",
        title: equipped.title || (isMastermind ? "Mastermind" : "ASSOCIATE"),
        orientation: equipped.orientation || "horizontal",
        hAlign: equipped.hAlign || defaultAlign,
        vAlign: equipped.vAlign || defaultAlign
      },
      profile: {
        title: profile.title || "",
        bio: profile.bio || "",
        company: profile.company || "",
        website: user.link_website || "",
        link_x: user.link_x || "",
        link_instagram: user.link_instagram || "",
        link_line: user.link_line || "",
        link_facebook: user.link_facebook || "",
        phone: user.phone || "",
        contact_email: profile.contact_email || ""
      }
    });
  } catch (error: any) {
    console.error("Fetch status error:", error);
    return NextResponse.json({ error: "Failed to fetch status." }, { status: 500 });
  }
}
