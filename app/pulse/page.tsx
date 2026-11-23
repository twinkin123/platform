import { getTokens } from "@/lib/scan";

export const dynamic = "force-dynamic";

function Spark({ seed, up }: { seed: string; up: boolean }) {
  let y = 11;
  const pts = [0];
  for (let i = 0; i < 12; i++) {
    y += ((seed.charCodeAt(i % seed.length) % 7) - 3) * (up ? -1 : 1) * 0.9;
    y = Math.max(2, Math.min(20, y));
    pts.push(y);
  }
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${i * 5.4} ${p.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 60 22" className="ml-auto h-5 w-[60px] shrink-0">
      <path d={d} fill="none" stroke={up ? "#2ee27a" : "#ff5c6b"} strokeWidth="1.4" />
    </svg>
  );
}

function Row({ t, i }: { t: Awaited<ReturnType<typeof getTokens>>[number]; i: number }) {
  const up = (t.mint.charCodeAt(0) + i) % 3 !== 0;
  const top10 = Number(t.top10Pct ?? 0);
  return (
    <li className={`flex flex-col gap-1.5 border-b border-[#10161f] px-3 py-2.5 hover:bg-[#0a0f17] ${i % 5 === 0 ? "border-l-2 border-l-[#a8842f]" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[15px] font-extrabold text-white"
          style={{ background: `linear-gradient(140deg, hsl(${t.mint.charCodeAt(1) % 360} 45% 28%), #0d1017)` }}>
          {t.ticker[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-extrabold leading-tight">{t.ticker}</p>
          <p className="truncate text-[10.5px] text-[#5f6b7d]">{t.name}</p>
        </div>
        <Spark seed={t.mint} up={up} />
      </div>
      <div className="flex gap-1 overflow-hidden">
        <span className="rounded border border-[#17402a] bg-[#0c2318] px-1 text-[9.5px] font-extrabold text-[#5fd897]">h {t.holders}</span>
        <span className="rounded border border-[#3a2f14] bg-[#241c0b] px-1 text-[9.5px] font-extrabold text-[#ffbf4d]">b {2 + (i % 5)}</span>
        <span className={`rounded border px-1 text-[9.5px] font-extrabold ${up ? "border-[#17402a] bg-[#0c2318] text-[#5fd897]" : "border-[#3d1c1f] bg-[#261112] text-[#ff7b85]"}`}>
          {up ? "+" : "−"}{8 + (i * 7) % 40}%
        </span>
      </div>
      <div className="flex gap-3 text-[9.5px] text-[#4f5a6a]">
        <div><b className={`block text-[11px] ${up ? "text-[#5fd897]" : "text-[#ff7b85]"}`}>${Number(t.mcapUsd ?? 0).toLocaleString()}</b>MCap</div>
        <div><b className="block text-[11px] text-[#aeb9c8]">${Number(t.liqUsd ?? 0).toLocaleString()}</b>Liq</div>
        <div><b className="block text-[11px] text-[#aeb9c8]">{10 + i}m</b>Age</div>
        <div><b className={`block text-[11px] ${top10 > 30 ? "text-[#ff7b85]" : "text-[#5fd897]"}`}>{top10.toFixed(1)}%</b>Top10</div>
        <div><b className="block text-[11px] text-[#aeb9c8]">{Number(t.devPct ?? 0).toFixed(1)}%</b>Dev</div>
      </div>
      <p className="truncate font-mono text-[9.5px] text-[#3f4957]">{t.mint.slice(0, 6)}…pump</p>
    </li>
  );
}

export default async function Pulse() {
  const tokens = await getTokens();
  const cols = [
    ["New pairs", tokens.filter((t) => t.state === "new")],
    ["Finishing", tokens.filter((t) => t.state === "filled")],
    ["Migrating", tokens.filter((t) => t.state === "migrating")],
  ] as const;

  return (
    <div className="flex h-dvh flex-col bg-[#05070a]">
      <header className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-[#141a23] bg-[#070a0f] px-4">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[#1b2b4d] to-[#0d1526] text-[11px] font-black text-[#7fa6ff]">S</span>
        <h1 className="text-sm font-extrabold">Pulse</h1>
        <span className="flex items-center gap-1.5 rounded border border-[#173726] bg-[#0b1d15] px-2 py-1 text-[11px] font-bold text-[#7fe0a8]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2ee27a]" />Live
        </span>
        <div className="ml-auto flex h-8 w-[260px] items-center gap-2 rounded-md border border-[#1a2230] bg-[#0d121a] px-2.5 text-xs text-[#4f5a6a]">
          ⌕ Searcl tokens, devs, tickers
        </div>
        <button className="h-7 rounded border border-[#1c2534] bg-[#0e141d] px-2.5 text-[11px] font-bold text-[#93a0b2]">All chains</button>
        <button className="h-7 rounded border border-[#1c2534] bg-[#0e141d] px-2.5 text-[11px] font-bold text-[#93a0b2]">Filters</button>
      </header>

      <div className="flex h-[30px] shrink-0 items-center gap-5 border-b border-[#10161f] bg-[#060910] px-4 text-[10.5px] text-[#4f5a6a]">
        <span>Launches 24h <b className="text-[#93a0b2]">8,412</b></span>
        <span>Graduated <b className="text-[#93a0b2]">137</b></span>
        <span>Avg dev hold <b className="text-[#93a0b2]">6.4%</b></span>
        <span>Net flow <b className="text-[#5fd897]">+$1.28M</b></span>
      </div>

      <div className="grid flex-1 grid-cols-3 overflow-hidden">
        {cols.map(([title, rows]) => (
          <section key={title} className="flex min-w-0 flex-col border-r border-[#141a23] last:border-r-0">
            <header className="flex h-[42px] shrink-0 items-center gap-1.5 border-b border-[#141a23] bg-[#080c12] px-3">
              <h2 className="text-xs font-extrabold">{title}</h2>
              <span className="rounded bg-[#131a24] px-1.5 text-[9.5px] font-extrabold text-[#5f6b7d]">{rows.length}</span>
            </header>
            <ul className="flex-1 overflow-hidden">
              {rows.map((t, i) => <Row key={t.mint} t={t} i={i} />)}
            </ul>
          </section>
        ))}
      </div>

      <footer className="flex h-10 shrink-0 items-center gap-4 border-t border-[#141a23] bg-[#070a0f] px-4 text-[11px] text-[#5f6b7d]">
        <span>P1 <b className="text-[#a9b4c3]">13.2K</b></span>
        <span>$28.9K</span><span>0.0</span><span>29</span><span>0.0</span><span>3</span>
        <div className="ml-auto flex gap-1.5">
          <span className="rounded border border-[#1c2534] bg-[#0e141d] px-2 py-1 text-[10px] font-extrabold">AUTO</span>
          <span className="rounded bg-[#8fb4ff] px-2 py-1 text-[10px] font-extrabold text-[#0a0f16]">SFX</span>
          <span className="rounded border border-[#1c2534] bg-[#0e141d] px-2 py-1 text-[10px] font-extrabold">Dev only</span>
        </div>
      </footer>
    </div>
  );
}