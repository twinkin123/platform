import Link from "next/link";

const nav = [
  ["Home", "/casino", "⌂"],
  ["Favourites", "/casino", "♡"],
  ["Latest Releases", "/casino", "✦"],
  ["Recently Played", "/casino", "↺"],
  ["Challenges", "/casino", "◎"],
  ["SHFL Lottery", "/casino", "◈"],
  ["SHFL Airdrop", "/casino", "✧"],
];

const second = [
  ["Promotions", "/casino", "◇"],
  ["Originals", "/casino", "◈"],
  ["Slots", "/casino", "▤"],
  ["Live Casino", "/casino", "◉"],
  ["Shuffle Picks", "/casino", "★"],
];

export default function Sidebar() {
  return (
    <aside className="hidden w-[330px] shrink-0 flex-col border-r border-[#17171d] bg-[#0b0b0f] px-4 py-[18px] lg:flex">
      <div className="mb-3.5 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center text-[17px] text-[#8e8e9c]">☰</div>
        <div className="flex flex-1 rounded-full border border-[#232338] bg-[#141420] p-1">
          <button className="h-9 flex-1 rounded-full bg-[#8b5cf6] text-xs font-extrabold text-white">Casino</button>
          <button className="h-9 flex-1 rounded-full text-xs font-extrabold text-[#7d7d8c]">Sports</button>
        </div>
      </div>

      <div className="mb-3 flex h-10 items-center rounded-lg border border-[#1e1e27] bg-[#101017] px-3 text-xs text-[#5f5f6d]">⌕ Search</div>

      <div className="mb-3 flex h-11 items-center gap-2 rounded-lg border border-[#1e1e27] bg-[#101017] px-3">
        <span className="text-[10px] font-black tracking-wider text-[#b39dff]">SHFL</span>
        <span className="text-xs font-extrabold num">$0.3301</span>
        <span className="ml-auto text-[10.5px] font-extrabold text-neg">−0.21%</span>
      </div>

      <div className="mb-4 flex gap-2">
        <button className="h-9 flex-1 rounded-md border border-[#1e1e27] bg-[#101017] text-xs font-bold text-[#a9a9b8]">Convert</button>
        <button className="h-9 flex-1 rounded-md border border-[#1e1e27] bg-[#101017] text-xs font-bold text-[#a9a9b8]">Dashboard</button>
      </div>

      <nav className="flex flex-col gap-px">
        {nav.map(([label, href, icon], i) => (
          <Link key={label} href={href}
            className={`flex h-[42px] items-center gap-2.5 rounded-md px-2.5 text-[13.5px] ${
              i === 0 ? "bg-[#17172a] font-extrabold text-ink shadow-[inset_3px_0_0_#8b5cf6]" : "text-[#8e8e9c] hover:bg-[#12121a]"
            }`}>
            <span className="opacity-70">{icon}</span>
            {label}
            {label === "Challenges" && <span className="ml-auto rounded bg-[#1e1e27] px-1.5 text-[10px] font-extrabold">10</span>}
            {label === "SHFL Lottery" && <span className="ml-auto rounded border border-[#3a2f14] bg-[#241c0b] px-1.5 text-[10px] font-extrabold text-amb">4d</span>}
            {label === "SHFL Airdrop" && <span className="ml-auto rounded border border-[#3a2f14] bg-[#241c0b] px-1.5 text-[10px] font-extrabold text-amb">5d</span>}
          </Link>
        ))}
        <div className="my-2 h-px bg-[#17171d]" />
        {second.map(([label, href, icon]) => (
          <Link key={label} href={href} className="flex h-[42px] items-center gap-2.5 rounded-md px-2.5 text-[13.5px] text-[#8e8e9c] hover:bg-[#12121a]">
            <span className="opacity-70">{icon}</span>
            {label}
            {label === "Promotions" && <span className="ml-auto opacity-50">›</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}