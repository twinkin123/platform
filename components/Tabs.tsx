"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/casino", label: "Casino" },
  { href: "/ville", label: "Ville" },
  { href: "/pulse", label: "Pulse" },
];

export default function Tabs() {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {items.map((i) => {
        const on = path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on ? "bg-white/10 text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]" : "text-ink-muted hover:bg-white/5 hover:text-ink"
            }`}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
