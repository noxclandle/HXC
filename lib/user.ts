import { prisma } from "@/lib/prisma";

let cachedAssetPrices: any = null;
let cachedAssetPricesExpiry = 0;

interface CachedProfile {
  data: any;
  expiry: number;
}

const profileCache = new Map<string, CachedProfile>();

export function clearProfileCache(slug: string) {
  const normalized = slug.toLowerCase();
  profileCache.delete(normalized);
}

export function getCachedProfile(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = decodedSlug.toLowerCase();
  const now = Date.now();
  const cached = profileCache.get(normalizedSlug);
  if (cached && now < cached.expiry) {
    return cached.data;
  }
  return null;
}

export async function getUserStatus(email: string | null | undefined) {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [user, assetPricesConfig, unreadCount, totalContacts, monthlyConnections] = await Promise.all([
    prisma.user.findUnique({
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
        address: true,
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
    }),
    (async () => {
      const now = Date.now();
      if (cachedAssetPrices && now < cachedAssetPricesExpiry) {
        return cachedAssetPrices;
      }
      const config = await prisma.systemConfig.findUnique({
        where: { key: 'asset_prices' }
      });
      if (config) {
        cachedAssetPrices = config;
        cachedAssetPricesExpiry = now + 60000; // Cache for 1 min
      }
      return config;
    })(),
    prisma.cardMessage.count({
      where: { target_user: { email: normalizedEmail }, is_read: false }
    }),
    prisma.contact.count({
      where: { owner: { email: normalizedEmail } }
    }),
    prisma.contact.count({
      where: { 
        owner: { email: normalizedEmail },
        created_at: { gte: firstDayOfMonth }
      }
    })
  ]);

  if (!user) return null;

  const userEmail = user.email?.toLowerCase() || "";
  const userName = user.name || "";
  const isFixer = user.role === "fixer" || 
                   userName.includes("福井") || 
                   userName.includes("Fukui") ||
                   userEmail.includes("str1yf5x");
  
  const allTitles = ["ASSOCIATE", "Observer", "Collector", "Messenger", "Connector", "Strategist", "Tech Lead", "Void Voyager", "Headhunter", "Gilded Soul", "The Sovereign", "Mastermind", "Architect", "Chief Officer", "APEX", "Fixer", "HERETIC", "NEXUS"];
  const titles = isFixer ? allTitles : (Array.isArray(user.unlocked_titles) ? user.unlocked_titles : ["ASSOCIATE"]);

  const ownedAssets = isFixer
    ? ["Obsidian", "Silver", "Gold", "Sakura", "RoseGold", "PearlWhite", "Moonlight", "Grace", "Silk", "Emerald", "Platinum", "Dynamic", "Crimson", "Void", "ImperialGold", "NebulaSteel", "GildedRose", "Default", "PastelSakura", "PearlVeil", "SilkSheet", "GraceGradient", "CrystalGlass", "Carbon", "BrushedMetal", "MonochromeGrid", "Stardust", "RoyalGold", "Nebula", "SilkBlur", "DigitalFlow", "PrismFractal", "GoldenHour", "MonochromeCyber", "None", "Sparkle", "FallingFlowers", "Feathers", "Bubbles", "Ribbons", "Glitch", "Petals", "Snow", "Aethereal", "Scanline", "Interference", "Dust", "Aurora", "Singularity", "CherryPetals", "BinaryCascade", "WhiteMist", "AzureFlame", "GoldenHalo", "VioletHaze", "EmeraldDust", "CrimsonFlare", "VoidEclipse", "PrismGlow", "CyberGrid", "StellarWind", "AbyssalEcho", "Pure White Hex", "Azure Trace", "Emerald Trace", "Ruby Trace", "Gold Trace", "Violet Trace", "Crimson Trace", "Shadow Trace", "Prism Trace", "Void Trace", "Nebula Trace", "Solar Trace", "resonance", "click", "wind", "water", "silver", "crystal", "deep", "heaven", "void", "omega", "ether", "pulse", "ZoomBgDefault", "ZoomBgCyber", "ZoomBgSlate", "ZoomBgWashi", "ZoomBgMist", "ZoomBgGold", "ZoomBgMattePlates", "ZoomBgBronze", "ZoomBgDawn", "ZoomBgPrism", "ZoomBgNebula"]
    : (Array.isArray(user.owned_assets) ? user.owned_assets : []);

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
    unread_messages: unreadCount,
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
    total_contacts: totalContacts,
    monthly_connections: monthlyConnections,
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
      vAlign: equipped.vAlign || defaultAlign,
      zoom_bg: equipped.zoom_bg || "ZoomBgDefault"
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
      address: user.address || "",
      contact_email: profile.contact_email || ""
    }
  };
}

export async function getPublicProfile(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = decodedSlug.toLowerCase();
  const now = Date.now();

  const cached = profileCache.get(normalizedSlug);
  if (cached && now < cached.expiry) {
    return cached.data;
  }

  // UUID形式かどうかを判定する正規表現
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug);

  const conditions: any[] = [
    { handle_name: { equals: decodedSlug, mode: "insensitive" as const } },
    { name: { equals: decodedSlug.replace(/-/g, " "), mode: "insensitive" as const } },
  ];

  if (isUuid) {
    conditions.push({ id: decodedSlug });
  }

  if (decodedSlug === "architect") {
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

  const result = {
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
      address: user.address || "",
      contact_email: profile.contact_email || user.email || ""
    }
  };

  // Cache public profile for 30 seconds to speed up scan load times
  profileCache.set(normalizedSlug, {
    data: result,
    expiry: now + 30000
  });

  // Also cache by ID to allow invalidation by ID
  profileCache.set(user.id.toLowerCase(), {
    data: result,
    expiry: now + 30000
  });

  return result;
}
