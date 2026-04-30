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

export async function checkAndAwardTitles(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { contacts: true }
  });

  if (!user) return [];

  const currentTitles = (user.unlocked_titles as string[]) || ["ASSOCIATE"];
  const newTitles: string[] = [];

  const resonanceCount = user.contacts.length;
  const highValueCount = user.contacts.filter(c => /社長|代表|CEO|役員|Director|President/i.test(c.notes || c.name || "")).length;
  const techCount = user.contacts.filter(c => /エンジニア|開発|Tech/i.test(c.notes || "")).length;
  const balance = Number(user.rt_balance);

  // --- 解禁ロジック ---
  if (resonanceCount >= 10 && !currentTitles.includes(TITLES.COLLECTOR)) newTitles.push(TITLES.COLLECTOR);
  if (resonanceCount >= 20 && !currentTitles.includes(TITLES.MESSENGER)) newTitles.push(TITLES.MESSENGER);
  if (resonanceCount >= 50 && !currentTitles.includes(TITLES.VOYAGER)) newTitles.push(TITLES.VOYAGER);
  if (resonanceCount >= 100 && !currentTitles.includes(TITLES.STRATEGIST)) newTitles.push(TITLES.STRATEGIST);
  
  if (highValueCount >= 5 && !currentTitles.includes(TITLES.HEADHUNTER)) newTitles.push(TITLES.HEADHUNTER);
  if (highValueCount >= 30 && !currentTitles.includes(TITLES.SOVEREIGN)) newTitles.push(TITLES.SOVEREIGN);

  if (techCount >= 10 && !currentTitles.includes(TITLES.TECH_LEAD)) newTitles.push(TITLES.TECH_LEAD);
  if (balance >= 50000 && !currentTitles.includes(TITLES.GILDED_SOUL)) newTitles.push(TITLES.GILDED_SOUL);

  if (newTitles.length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { unlocked_titles: [...currentTitles, ...newTitles] }
    });
  }

  return newTitles;
}
