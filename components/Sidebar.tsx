import Link from "next/link";
import { Dices, LayoutGrid, UserRound, Disc3, Gift, Crown, Coins } from "lucide-react";

const nav = [
  { label: "Originals", href: "/casino", Icon: Dices, count: 1, on: true },
  { label: "Slots", href: "/casino", Icon: LayoutGrid, count: 3 },
  { label: "Live Casino", href: "/casino", Icon: UserRound, count: 4 },
  { label: "Table Games", href: "/casino", Icon: Disc3, count: 0 },
  { label: "Promotions", href: "/casino", Icon: Gift },
  { label: "VIP", href: "/casino", Icon: Crown },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-[76px] hidden h-[calc(100dvh-76px)] w-[330px] shrink-0 flex-col overflow-y-auto border-r border-[#17171c] bg-black px-5 py-5 lg:flex">
      <div className="rounded-2xl border border-[#202029] bg-[#0f0f14] p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#ffd24a] to-[#e0952b]">
            <Coins size={20} className="text-[#3a2600]" strokeWidth={2.6} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[#9a9aa8]">Balance</p>
            <p className="text-[26px] font-black leading-tight tracking-[-0.02em] tabular-nums text-white">490.00 SL$</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2.5">
          <button className="h-11 flex-1 rounded-xl bg-[#7c5cff] text-[13.5px] font-extrabold text-white hover:bg-[#8d70ff]">
            Deposit
          </button>
          <button className="h-11 flex-1 rounded-xl border border-[#2a2a36] bg-transparent text-[13.5px] font-extrabold text-white hover:bg-[#16161d]">
            Withdraw
          </button>
        </div>
      </div>

      <nav className="mt-5 flex flex-col">
        {nav.map(({ label, href, Icon, count, on }) => (
          <Link
            key={label}
            href={href}
            className={
              "flex h-[52px] items-center gap-3.5 rounded-lg px-2 text-[15px] transition " +
              (on ? "font-extrabold text-white" : "font-semibold text-[#9a9aa8] hover:bg-[#101016] hover:text-white")
            }
          >
            <Icon size={19} strokeWidth={2.2} className={on ? "text-white" : "text-[#7e7e8c]"} />
            {label}
            {count !== undefined && (
              <span className="ml-auto text-[14px] font-semibold tabular-nums text-[#6f6f7d]">{count}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-[#202029] bg-[#0f0f14] px-4 py-5 text-center">
          <p className="text-[14px] font-extrabold text-white">SHFL VIP</p>
          <div className="relative mx-auto mt-3 h-[104px] w-[104px]">
            <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90">
              <circle cx="52" cy="52" r="44" fill="none" stroke="#202029" strokeWidth="10" />
              <circle
                cx="52" cy="52" r="44" fill="none" stroke="#7c5cff" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="199 277"
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[19px] font-black text-white">72%</span>
          </div>
          <p className="mt-3 text-[13px] font-semibold text-[#8b8b98]">72% to Gold</p>
        </div>
      </div>
    </aside>
  );
}