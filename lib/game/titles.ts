import { prisma } from "@/lib/prisma";

export const TITLES = {
  INITIATE: "Initiate",
  OBSERVER: "Observer",
  COLLECTOR: "Collector",
  MESSENGER: "Messenger",
  CONNECTOR: "Connector",
  DATA_ENTRY: "Data Entry",
  TECH_LEAD: "Tech Lead",
  VOYAGER: "Void Voyager",
  HEADHUNTER: "Headhunter",
  GILDED_SOUL: "Gilded Soul",
  SOVEREIGN: "The Sovereign",
  ARCHITECT: "Architect",
  CHIEF: "Chief Officer"
};

/**
 * 称号の解禁チェック
 */
export async function checkAndAwardTitles(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { contacts: true }
  });

  if (!user) return [];

  const currentTitles = (user.unlocked_titles as string[]) || ["Initiate"];
  const newTitles: string[] = [];

  const resonanceCount = user.contacts.length;
  const highValueCount = user.contacts.filter(c => /社長|代表|CEO|役員|Director|President/i.test(c.notes || c.name || "")).length;
  const techCount = user.contacts.filter(c => /エンジニア|開発|Tech/i.test(c.notes || "")).length;
  const balance = Number(user.rt_balance);

  // --- 解禁ロジック ---
  
  // Scans
  if (resonanceCount >= 10 && !currentTitles.includes(TITLES.COLLECTOR)) newTitles.push(TITLES.COLLECTOR);
  if (resonanceCount >= 20 && !currentTitles.includes(TITLES.MESSENGER)) newTitles.push(TITLES.MESSENGER);
  if (resonanceCount >= 50 && !currentTitles.includes(TITLES.VOYAGER)) newTitles.push(TITLES.VOYAGER);
  
  // Executive Focus (Gold/Red)
  if (highValueCount >= 5 && !currentTitles.includes(TITLES.HEADHUNTER)) newTitles.push(TITLES.HEADHUNTER);
  if (highValueCount >= 30 && !currentTitles.includes(TITLES.SOVEREIGN)) newTitles.push(TITLES.SOVEREIGN);

  // Technical Focus (Purple)
  if (techCount >= 10 && !currentTitles.includes(TITLES.TECH_LEAD)) newTitles.push(TITLES.TECH_LEAD);

  // Points (Gold)
  if (balance >= 50000 && !currentTitles.includes(TITLES.GILDED_SOUL)) newTitles.push(TITLES.GILDED_SOUL);

  // 更新処理
  if (newTitles.length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { unlocked_titles: [...currentTitles, ...newTitles] }
    });
  }

  return newTitles;
}
