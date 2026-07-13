import { prisma } from "@/lib/prisma";

export const TITLES = {
  ASSOCIATE: "ASSOCIATE",     // 初期
  INITIATE: "Initiate",       // アカウント作成
  OBSERVER: "Observer",       // 閲覧
  COLLECTOR: "Collector",     // 10 connections
  MESSENGER: "Messenger",     // 20 connections
  CONNECTOR: "Connector",     // 称号としてのコネクター
  STRATEGIST: "Strategist",   // 100 connections (New)
  TECH_LEAD: "Tech Lead",     // エンジニア系
  VOYAGER: "Void Voyager",    // 50 connections
  HEADHUNTER: "Headhunter",   // 社長系
  GILDED_SOUL: "Gilded Soul", // 50,000 CP保有
  SOVEREIGN: "The Sovereign", // 重役多数
  MASTERMIND: "Mastermind",   // 究極 (New)
  ARCHITECT: "Architect",     // 管理者級
  CHIEF: "Chief Officer",     // システム全権
  APEX: "APEX"                // ブラックカード保有者
};

type TitleMetric = "resonanceCount" | "highValueCount" | "techCount" | "balance";

export interface AutoGrantTitleCondition {
  title: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  metric: TitleMetric;
  threshold: number;
  description: string;
}

/**
 * 自動付与される称号の条件。checkAndAwardTitles と app/admin/items の表示、
 * どちらもここを唯一の情報源として参照する（表示が実際の付与条件とズレるのを防ぐ）。
 * ASSOCIATE / Mastermind / Chief Officer / APEX は自動付与対象外（初期付与・管理者付与・購入時付与）。
 */
export const AUTO_GRANT_TITLE_CONDITIONS: AutoGrantTitleCondition[] = [
  { title: TITLES.COLLECTOR, rarity: "rare", metric: "resonanceCount", threshold: 10, description: "10人以上のユーザーと接続を記録。" },
  { title: TITLES.MESSENGER, rarity: "rare", metric: "resonanceCount", threshold: 20, description: "20人以上のユーザーと接続を記録。" },
  { title: TITLES.VOYAGER, rarity: "epic", metric: "resonanceCount", threshold: 50, description: "50人以上のユーザーと接続を記録。" },
  { title: TITLES.STRATEGIST, rarity: "epic", metric: "resonanceCount", threshold: 100, description: "100人以上のユーザーと接続を記録。広範な影響力の証。" },
  { title: TITLES.HEADHUNTER, rarity: "epic", metric: "highValueCount", threshold: 5, description: "経営層（社長・代表等）5人以上との接続。" },
  { title: TITLES.SOVEREIGN, rarity: "mythic", metric: "highValueCount", threshold: 30, description: "経営層30人以上との接続。支配的なネットワークの構築。" },
  { title: TITLES.TECH_LEAD, rarity: "rare", metric: "techCount", threshold: 10, description: "開発・技術職10人以上との接続。" },
  { title: TITLES.GILDED_SOUL, rarity: "epic", metric: "balance", threshold: 50000, description: "50,000 RT以上を保有する資産家。" },
];

export async function checkAndAwardTitles(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { contacts: true }
  });

  if (!user) return [];

  const currentTitles = (user.unlocked_titles as string[]) || ["ASSOCIATE"];
  const newTitles: string[] = [];

  const metrics: Record<TitleMetric, number> = {
    resonanceCount: user.contacts.length,
    highValueCount: user.contacts.filter(c => /社長|代表|CEO|役員|Director|President/i.test(c.notes || c.name || "")).length,
    techCount: user.contacts.filter(c => /エンジニア|開発|Tech/i.test(c.notes || "")).length,
    balance: Number(user.rt_balance),
  };

  for (const condition of AUTO_GRANT_TITLE_CONDITIONS) {
    if (metrics[condition.metric] >= condition.threshold && !currentTitles.includes(condition.title)) {
      newTitles.push(condition.title);
    }
  }

  if (newTitles.length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { unlocked_titles: [...currentTitles, ...newTitles] }
    });
  }

  return newTitles;
}
