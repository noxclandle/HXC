import { getUserStatus } from "@/lib/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BackgroundGenerator from "@/components/hub/BackgroundGenerator";

export default async function BackgroundPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const status = await getUserStatus(session.user.email);
  if (!status) redirect("/login");

  return <BackgroundGenerator userSlug={status.slug} />;
}
