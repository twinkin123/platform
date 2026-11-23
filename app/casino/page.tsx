import Banner from "@/components/Banner";
import GameCard from "@/components/GameCard";
import { GAMES } from "@/lib/games";

const banners = [
  { src: "/banners/1.webp", tag: "NEW", title: "Anubis\nRising", cta: "Play", tint: "#8b5cf6" },
  { src: "/banners/2.webp", tag: "EXCLUSIVE", title: "Wild\nWeekend", cta: "Claim", tint: "#ec4899" },
  { src: "/banners/3.webp", tag: "DAILY", title: "Emerald\nBoost", cta: "Join", tint: "#10b981" },
];

function Row({ title, list }: { title: string; list: typeof GAMES }) {
  return (
    <section className="mb-6">
      <div className="mb-2.5 flex items-center">
        <h2 className="text-[15px] font-black">{title}</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-1.5 text-xs text-[#8e8e9c]">View all</span>
          <span className="grid h-7 w-7 place-items-center rounded-md border border-[#23233a] bg-[#141420] text-[#a9a9b8]">‹</span>
          <span className="grid h-7 w-7 place-items-center rounded-md border border-[#23233a] bg-[#141420] text-[#a9a9b8]">›</span>
        </div>
      </div>
      <div className="flex gap-3 overflow-hidden">
        {list.map((g) => <GameCard key={g.id} game={g} />)}
      </div>
    </section>
  );
}

export default function Lobby() {
  return (
    <div className="px-6 pb-8">
      <div className="flex h-[74px] items-center">
        <Link href="/casino" className="flex items-center gap-2.5 text-[30px] font-black tracking-tight">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#4c1d95] text-base">S</span>
          SABLE
        </Link>
        <div className="ml-auto flex gap-2">
          <button className="h-10 rounded-md border border-[#23233a] bg-[#141420] px-5 text-[13px] font-extrabold text-[#c9c9d8]">Login</button>
          <button className="h-10 rounded-md bg-[#8b5cf6] px-5 text-[13px] font-extrabold text-white">Register</button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3.5">
        {banners.map((b) => <Banner key={b.src} {...b} />)}
      </div>

      <div className="mb-4 flex items-center border-b border-[#17171d]">
        <div className="flex gap-5 text-sm font-extrabold">
          {["Lobby", "Originals", "Slots", "Live Casino", "Table Games"].map((t, i) => (
            <span key={t} className={i === 0 ? "border-b-2 border-[#8b5cf6] pb-3 text-white" : "pb-3 text-[#7d7d8c]"}>{t}</span>
          ))}
        </div>
        <div className="ml-auto mb-2 flex h-9 w-[220px] items-center gap-2 rounded-md border border-[#1e1e27] bg-[#101017] px-3 text-xs text-[#5f5f6d]">
          ⌕ Search games
          <span className="ml-auto rounded border border-[#2a2a36] px-1.5 text-[9.5px]">Ctrl K</span>
        </div>
      </div>

      <Row title="Shuffle Games" list={GAMES.slice(0, 7)} />
      <Row title="Slots" list={[...GAMES.slice(3), ...GAMES.slice(0, 3)]} />
    </div>
  );
}