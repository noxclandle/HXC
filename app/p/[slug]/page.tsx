import { getPublicProfile } from "@/lib/user";
import ProfileClientUI from "@/components/profile/ProfileClientUI";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPublicProfile(params.slug);
  if (!data) return { title: "Identity Dissolved" };
  
  return {
    title: `${data.name} | Hexa Card Identity`,
    description: data.profile.bio || "Synchronize your identity via the Hexa Card.",
    openGraph: {
      title: `${data.name} | Hexa Card`,
      description: data.profile.bio || "Digital Identity Protocol",
      images: data.photo_url ? [data.photo_url] : [],
    }
  };
}

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const data = await getPublicProfile(params.slug);

  if (!data) return (
    <div className="min-h-screen bg-void flex items-center justify-center text-[10px] uppercase tracking-[0.5em] opacity-40 text-white text-center p-12">
      Identity Dissolved / 実体が見つかりません
    </div>
  );

  return (
    <ProfileClientUI data={data} />
  );
}
