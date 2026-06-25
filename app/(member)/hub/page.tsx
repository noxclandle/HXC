import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStatus } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import HubClientUI from "@/components/hub/HubClientUI";
import HubErrorBoundary from "@/components/hub/HubErrorBoundary";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// 改善されたスケルトン：高級感のあるシマー効果
function HubSkeleton() {
  return (
    <div className="max-w-7xl mx-auto pt-24 px-6">
       <div className="h-10 w-64 bg-white/5 rounded-sm mb-12 animate-pulse" />
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 h-[500px] bg-white/[0.01] border border-white/5 rounded-sm animate-pulse" />
          <div className="lg:col-span-4 space-y-8">
             <div className="h-64 bg-white/[0.01] border border-white/5 rounded-sm animate-pulse" />
             <div className="h-64 bg-white/[0.01] border border-white/5 rounded-sm animate-pulse" />
          </div>
       </div>
    </div>
  );
}

let cachedNews: any = null;
let cachedNewsExpiry = 0;

async function HubLoader() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const [stats, news] = await Promise.all([
    getUserStatus(session.user.email),
    (async () => {
      const now = Date.now();
      if (cachedNews && now < cachedNewsExpiry) {
        return cachedNews;
      }
      const announcements = await prisma.announcement.findMany({
        where: { is_published: true },
        orderBy: { created_at: "desc" },
        take: 1
      });
      if (announcements) {
        cachedNews = announcements;
        cachedNewsExpiry = now + 60000; // Cache for 1 min
      }
      return announcements;
    })()
  ]);

  if (!stats) redirect("/guide");

  const serializedNews = news[0] ? {
    id: news[0].id,
    title: news[0].title,
    content: news[0].content,
    type: news[0].type,
    created_at: news[0].created_at.toISOString(),
    updated_at: news[0].updated_at.toISOString()
  } : null;

  return (
    <HubErrorBoundary>
      <HubClientUI 
        initialStats={stats} 
        initialNews={serializedNews} 
      />
    </HubErrorBoundary>
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
