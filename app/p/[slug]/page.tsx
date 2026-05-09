import { getPublicProfile, getSoulLinkedUser } from "@/lib/user";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPublicProfile(params.slug);
  if (!data) return { title: "Identity Dissolved" };
  
  return {
    title: `${data.name} | Hexa Card Identity`,
    description: data.profile.bio || "Synchronize your identity via the Hexa Card.",
  };
}

// 爆速化のための「即時表示スケルトン」
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-6 animate-pulse">
       <div className="w-full max-w-md aspect-[1.58/1] border border-white/5 bg-white/[0.02] rounded-sm" />
       <div className="mt-12 w-32 h-2 bg-white/5" />
    </div>
  );
}

async function ProfileLoader({ slug }: { slug: string }) {
  const [data, session] = await Promise.all([
    getPublicProfile(slug),
    getServerSession(authOptions)
  ]);

  if (!data) return (
    <div className="min-h-screen bg-void flex items-center justify-center text-[10px] uppercase tracking-[0.5em] opacity-40 text-white text-center p-12">
      Identity Dissolved / 実体が見つかりません
    </div>
  );

  const isOwner = session?.user?.id === data.id || session?.user?.email === data.email;

  return <ProfileClientUI data={data} isOwner={isOwner} />;
}

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  return (
    <main className="bg-void min-h-screen">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileLoader slug={params.slug} />
      </Suspense>
    </main>
  );
}
