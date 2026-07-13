import { prisma } from "@/lib/prisma";
import { ASSETS } from "@/lib/game/assets";
import { getLevelFromExp } from "@/lib/game/level";
import { Prisma, SystemConfig } from "@prisma/client";
import { logger } from "@/lib/logger";

let cachedAssetPrices: SystemConfig | null = null;
let cachedAssetPricesExpiry = 0;

export interface EquippedAssets {
  frame?: string;
  title?: string;
  orientation?: string;
  hAlign?: Record<string, string>;
  vAlign?: Record<string, string>;
  zoom_bg?: string;
  aura_harmony?: number;
}

export interface AIConfig {
  profile?: {
    title?: string;
    bio?: string;
    company?: string;
    contact_email?: string;
  };
}

export interface UserStatus {
  id: string;
  name: string;
  rt_balance: string;
  exp: string;
  exp_max: string;
  level: number;
  unread_messages: number;
  portfolio_links: Prisma.JsonValue;
  rank: string;
  role: string;
  last_daily_at: string | null;
  last_read_news_at: string | null;
  titles: string[];
  owned_assets: string[];
  asset_prices: Record<string, number>;
  uid: string;
  handle: string;
  handle_name: string;
  slug: string;
  total_contacts: number;
  monthly_connections: number;
  logo_url: string;
  photo_url: string;
  equipped: EquippedAssets;
  profile: {
    title: string;
    bio: string;
    company: string;
    website: string;
    link_x: string;
    link_instagram: string;
    link_line: string;
    link_facebook: string;
    phone: string;
    address: string;
    contact_email: string;
  };
}

export interface PublicProfile {
  id: string;
  name: string | null;
  handle_name: string | null;
  rank: string;
  email: string | null;
  photo_url: string | null;
  logo_url: string | null;
  phone: string | null;
  role: string;
  rt_balance: string;
  exp: string;
  equipped_assets: Prisma.JsonValue;
  link_x: string | null;
  link_instagram: string | null;
  link_line: string | null;
  link_facebook: string | null;
  portfolio_links: Prisma.JsonValue;
  profile: {
    company: string;
    title: string;
    bio: string;
    website: string;
    address: string;
    contact_email: string;
  };
}

interface CachedProfile {
  data: PublicProfile | null;
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

  const [user, assetPricesConfig, unreadCount, monthlyConnections] = await Promise.all([
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
        },
        _count: {
          select: {
            contacts: true
          }
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
        cachedAssetPricesExpiry = now + 300000; // Cache for 5 mins
      }
      return config;
    })(),
    prisma.cardMessage.count({
      where: { target_user: { email: normalizedEmail }, is_read: false }
    }),
    prisma.contact.count({
      where: { 
        owner: { email: normalizedEmail },
        created_at: { gte: firstDayOfMonth }
      }
    })
  ]);

  if (!user) return null;

  const totalContacts = user._count?.contacts ?? 0;

  const isFixer = user.role === "fixer";
  
  const allTitles = ["ASSOCIATE", "Observer", "Collector", "Messenger", "Connector", "Strategist", "Tech Lead", "Void Voyager", "Headhunter", "Gilded Soul", "The Sovereign", "Mastermind", "Architect", "Chief Officer", "APEX", "Fixer", "HERETIC", "NEXUS"];
  const titles = isFixer ? allTitles : (Array.isArray(user.unlocked_titles) ? user.unlocked_titles : ["ASSOCIATE"]);

  const ownedAssets = isFixer
    ? ASSETS.map(a => a.id)
    : (Array.isArray(user.owned_assets) ? user.owned_assets : []);

  const assetPrices = assetPricesConfig?.value || {};

  const aiConfig = (user.ai_config as AIConfig | null) || {};
  const profile = aiConfig.profile || {};
  const equipped = (user.equipped_assets as EquippedAssets | null) || {};

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
    exp: user.exp.toString(),
    exp_max: "30000", // レベル30到達に必要な最大EXP
    level: getLevelFromExp(user.exp),
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
    handle_name: user.handle_name || "",
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
      contact_email: profile.contact_email || user.email || ""
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

  const conditions: Prisma.UserWhereInput[] = [
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

  const aiConfig = (user.ai_config as AIConfig | null) || {};
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

// IPとターゲットIDの24時間閲覧ログキャッシュ（インメモリ）
const viewCache = new Map<string, number>();

export async function rewardProfileView(targetUserId: string, ipAddress: string): Promise<boolean> {
  const cleanIp = ipAddress.split(',')[0].trim(); // プロキシ環境対応
  const cacheKey = `${cleanIp}_to_${targetUserId}`;
  const now = Date.now();
  const expiry = viewCache.get(cacheKey);

  if (!expiry || now > expiry) {
    // 24時間有効
    viewCache.set(cacheKey, now + 24 * 60 * 60 * 1000);

    // メモリ保護: キャッシュが大きくなりすぎた場合は期限切れをクリーンアップ
    if (viewCache.size > 5000) {
      for (const [key, val] of viewCache.entries()) {
        if (now > val) viewCache.delete(key);
      }
    }

    try {
      await prisma.user.update({
        where: { id: targetUserId },
        data: {
          exp: { increment: 5 } // 被アクセスで一律 +5 EXP
        }
      });
      return true;
    } catch (e) {
      logger.error("Profile view EXP reward error", { error: e });
      return false;
    }
  }
  return false;
}
