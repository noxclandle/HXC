import ResidentAgent from "@/components/agent/ResidentAgent";
import Link from "next/link";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <nav className="fixed top-0 left-0 p-8 z-40">
        <Link href="/hub" className="opacity-40 hover:opacity-100 transition-opacity">
           <img src="/logo.png" alt="Hexa Card" className="w-10 h-10 object-contain" />
        </Link>
      </nav>
      <main className="pb-24">{children}</main>
      <ResidentAgent />
    </div>
  );
}
