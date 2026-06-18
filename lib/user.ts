import { prisma } from "@/lib/prisma";

export async function getUserStatus(email: string | null | undefined) {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      rank: true,
      rt_balance: true,
      exp: true,
      unlocked_titles: true,
      owned_assets: true,
      handle_name: true,
      logo_url: true,
      photo_url: true,
      link_website: true,
      phone: true,
      ai_config: true,
      equipped_assets: true,
      link_x: true,
      link_instagram: true,
      link_line: true,
      link_facebook: true,
      portfolio_links: true,
      last_daily_at: true,
      last_read_news_at: true,
      card: {
        select: { uid: true }
      }
    }
  });

  if (!user) return null;

  // Fixer (Go Fukui) check - Extremely robust
  const userEmail = user.email?.toLowerCase() || "";
  const userName = user.name || "";
  const isFixer = user.role === "fixer" || 
                   userName.includes("福井") || 
                   userName.includes("Fukui") ||
                   userEmail.includes("str1yf5x");
  
  // All available titles in the system
  const allTitles = ["ASSOCIATE", "Observer", "Collector", "Messenger", "Connector", "Strategist", "Tech Lead", "Void Voyager", "Headhunter", "Gilded Soul", "The Sovereign", "Mastermind", "Architect", "Chief Officer", "APEX", "Fixer"];
  
  const titles = isFixer ? allTitles : (Array.isArray(user.unlocked_titles) ? user.unlocked_titles : ["ASSOCIATE"]);

  const ownedAssets = isFixer
    ? ["Obsidian", "Silver", "Gold", "Sakura", "RoseGold", "PearlWhite", "Moonlight", "Grace", "Silk", "Emerald", "Platinum", "Dynamic", "Crimson", "Void", "ImperialGold", "Default", "PastelSakura", "PearlVeil", "SilkSheet", "GraceGradient", "CrystalGlass", "Carbon", "BrushedMetal", "MonochromeGrid", "Stardust", "RoyalGold", "Nebula", "SilkBlur", "DigitalFlow", "PrismFractal", "None", "Sparkle", "FallingFlowers", "Feathers", "Bubbles", "Ribbons", "Glitch", "Petals", "Snow", "Aethereal", "Scanline", "Interference", "Dust", "Aurora", "Singularity", "WhiteMist", "AzureFlame", "GoldenHalo", "VioletHaze", "EmeraldDust", "CrimsonFlare", "VoidEclipse", "PrismGlow", "CyberGrid", "Pure White Hex", "Azure Trace", "Emerald Trace", "Ruby Trace", "Gold Trace", "Violet Trace", "Crimson Trace", "Shadow Trace", "Prism Trace", "Void Trace", "resonance", "click", "wind", "water", "silver", "crystal", "deep", "heaven", "void", "omega"]
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

  return {
    id: user.id,
    name: user.name || "ARCHITECT",
    rt_balance: user.rt_balance.toString(),
    exp: isFixer ? "10000" : user.exp.toString(),
    exp_max: isFixer ? "10000" : "1000", // EXPの上限表示用
    unread_messages: await prisma.cardMessage.count({
      where: { target_user_id: user.id, is_read: false }
    }),
    portfolio_links: user.portfolio_links || [],
    rank: isFixer ? "Fixer" : user.rank,
    role: isFixer ? "fixer" : user.role, // Force role to fixer in UI
    last_daily_at: user.last_daily_at ? user.last_daily_at.toISOString() : null,
    last_read_news_at: user.last_read_news_at ? user.last_read_news_at.toISOString() : null,
    titles: titles,
    owned_assets: ownedAssets,
    asset_prices: assetPrices,
    uid: user.card?.uid || "NO CARD LINKED",
    handle: user.handle_name || "", 
    slug: user.handle_name || user.id,
    // 画像がBase64で巨大な場合、初期通信を圧迫するため、
    // ここではデータの存在有無のみを返し、実際の表示はキャッシュや別ルートで行うよう検討
    logo_url: user.logo_url && user.logo_url.length > 5000 ? "IMAGE_LARGE" : (user.logo_url || ""),
    photo_url: user.photo_url && user.photo_url.length > 5000 ? "IMAGE_LARGE" : (user.photo_url || ""),
    equipped: {
      ...equipped,
      frame: equipped.frame || "Obsidian",
      title: equipped.title || (isFixer ? "Fixer" : "ASSOCIATE"),
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
  };
}

export async function getPublicProfile(slug: string) {
  // UUID形式かどうかを判定する正規表現
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  const conditions: any[] = [
    { handle_name: { equals: slug, mode: "insensitive" as const } },
    { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" as const } },
  ];

  if (isUuid) {
    conditions.push({ id: slug });
  }

  if (slug === "architect") {
    conditions.push({ email: "str1yf5x@gmail.com" });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: conditions
    },
    select: {
      id: true,
      name: true,
      handle_name: true,
      rank: true,
      address: true,
      phone: true,
      email: true,
      photo_url: true,
      logo_url: true,
      link_website: true,
      ai_config: true,
      equipped_assets: true,
      link_x: true,
      link_instagram: true,
      link_line: true,
      link_facebook: true,
      portfolio_links: true,
      rt_balance: true,
      exp: true,
      role: true,
    }
  });

  if (!user) return null;

  const aiConfig = (user.ai_config as any) || {};
  const profile = aiConfig.profile || {};

  return {
    id: user.id,
    name: user.name,
    handle_name: user.handle_name,
    rank: user.rank,
    email: user.email,
    photo_url: user.photo_url,
    logo_url: user.logo_url,
    phone: user.phone,
    role: user.role,
    rt_balance: user.rt_balance.toString(),
    exp: user.exp.toString(),
    equipped_assets: user.equipped_assets,
    link_x: user.link_x,
    link_instagram: user.link_instagram,
    link_line: user.link_line,
    link_facebook: user.link_facebook,
    portfolio_links: user.portfolio_links || [],
    profile: {
      company: profile.company || "",
      title: profile.title || "",
      bio: profile.bio || "",
      website: user.link_website || "",
      contact_email: profile.contact_email || user.email || ""
    }
  };
}
