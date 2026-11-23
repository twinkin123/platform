"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dices, Castle, Activity, Coins, UserRound } from "lucide-react";

const heads = [
  { label: "Casino", href: "/casino", Icon: Dices },
  { label: "Ville", href: "/ville", Icon: Castle },
  { label: "Pulse", href: "/pulse", Icon: Activity },
];

export default function TopBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-[#17171c] bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-full max-w-[1800px] items-center gap-4 px-6">
        <Link href="/casino" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-white">
            <span className="text-[19px] font-black leading-none text-black">S</span>
          </span>
          <span className="text-[25px] font-black tracking-[-0.03em] text-white">SHUFFLE</span>
        </Link>

        <nav className="ml-4 flex items-center gap-1 rounded-full border border-[#1e1e26] bg-[#0f0f14] p-1.5">
          {heads.map(({ label, href, Icon }) => {
            const on = path.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={
                  "flex h-10 items-center gap-2 rounded-full px-5 text-[13.5px] font-extrabold transition " +
                  (on
                    ? "bg-[#7c5cff] text-white shadow-[0_0_24px_rgba(124,92,255,0.35)]"
                    : "text-[#8b8b98] hover:text-white")
                }
              >
                <Icon size={16} strokeWidth={2.4} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex h-11 items-center gap-2.5 rounded-full border border-[#1e1e26] bg-[#0f0f14] pl-1.5 pr-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#ffd24a] to-[#e0952b]">
              <Coins size={16} className="text-[#3a2600]" strokeWidth={2.6} />
            </span>
            <span className="text-[14.5px] font-extrabold tabular-nums text-white">490.00 SL$</span>
          </div>
          <button className="px-2 text-[13.5px] font-bold text-[#b6b6c2] hover:text-white">Login</button>
          <button className="h-11 rounded-xl bg-white px-6 text-[13.5px] font-extrabold text-black hover:bg-[#ececf2]">
            Register
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-[#1e1e26] bg-[#0f0f14] text-[#9a9aa8]">
            <UserRound size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}