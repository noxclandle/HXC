import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStatus } from "@/lib/user";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import InventoryClientUI from "@/components/inventory/InventoryClientUI";
import HubErrorBoundary from "@/components/hub/HubErrorBoundary";

export const dynamic = "force-dynamic";

async function InventoryLoader() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const stats = await getUserStatus(session.user.email);
  if (!stats) redirect("/activate");

  return (
    <HubErrorBoundary>
      <InventoryClientUI initialStats={stats} />
    </HubErrorBoundary>
  );
}

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-void">
      <Suspense fallback={
        <div className="min-h-screen bg-void flex items-center justify-center text-[10px] tracking-widest opacity-20 uppercase">
          Loading Treasury...
        </div>
      }>
        <InventoryLoader />
      </Suspense>
    </main>
  );
}
