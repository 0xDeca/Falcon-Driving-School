import Link from "next/link";
import { cn } from "@/lib/utils";

export function TrafficLightLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="flex flex-col gap-[3px] rounded-md bg-surface-dark p-1.5 shadow-inner">
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-red transition-all group-hover:shadow-[0_0_8px_#DC2626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-amber transition-all group-hover:shadow-[0_0_8px_#F59E0B]" />
        <span className="h-2.5 w-2.5 rounded-full bg-traffic-green transition-all group-hover:shadow-[0_0_8px_#15803D]" />
      </div>
      <span className="display text-lg font-bold tracking-tight">
        Falcon<span className="text-traffic-green">.</span>
      </span>
    </Link>
  );
}
