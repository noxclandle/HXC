import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStatus } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import HubClientUI from "@/components/hub/HubClientUI";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MemberHubPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // サーバーサイドで全データを一括取得（Prisma直叩きで最速）
  const [stats, contacts, news] = await Promise.all([
    getUserStatus(session.user.email),
    prisma.contact.findMany({
      where: { owner_id: (session.user as any).id },
      orderBy: { created_at: "desc" }
    }),
    prisma.announcement.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
      take: 1
    })
  ]);

  if (!stats) {
    redirect("/activate");
  }

  // 座標のランダム化（サーバーサイドで行い、クライアントでのハイドレーションエラーを防ぐ）
  const contactsWithCoords = contacts.map((c) => ({
    ...c,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10
  }));

  return (
    <HubClientUI 
      initialStats={stats} 
      initialContacts={contactsWithCoords} 
      initialNews={news[0] || null} 
    />
  );
}
