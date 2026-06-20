import ResidentAgent from "@/components/agent/ResidentAgent";
import HiddenRTMonitor from "@/components/ui/HiddenRTMonitor";
import HubErrorBoundary from "@/components/hub/HubErrorBoundary";
import Link from "next/link";
import Image from "next/image";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <nav className="fixed top-0 left-0 p-8 z-40">
        <Link href="/hub" className="opacity-40 hover:opacity-100 transition-opacity">
           <Image 
             src="/logo.png" 
             alt="Hexa Card" 
             width={40} 
             height={40} 
             className="object-contain" 
           />
        </Link>
      </nav>
      <main>{children}</main>
      <HubErrorBoundary>
        <ResidentAgent />
        <HiddenRTMonitor />
      </HubErrorBoundary>
    </div>
  );
}
