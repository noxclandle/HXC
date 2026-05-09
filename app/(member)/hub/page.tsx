import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStatus } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import HubClientUI from "@/components/hub/HubClientUI";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// 阿部寛スピードのための即時表示シェル
function HubSkeleton() {
  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 animate-pulse">
       <div className="h-12 w-48 bg-white/5 mb-12" />
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 h-96 bg-white/[0.02] border border-white/5" />
          <div className="lg:col-span-4 h-96 bg-white/[0.02] border border-white/5" />
       </div>
    </div>
  );
}

async function HubLoader() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

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

  if (!stats) redirect("/activate");

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

export default function MemberHubPage() {
  return (
    <main className="min-h-screen bg-void">
      <Suspense fallback={<HubSkeleton />}>
        <HubLoader />
      </Suspense>
    </main>
  );
}
