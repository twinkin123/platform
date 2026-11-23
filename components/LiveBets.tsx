"use client";
import { useEffect, useState } from "react";

const names = ["kestrel", "0xvine", "nori", "plum", "vex", "juno", "moss", "tallow", "brik", "hexa"];
const games = ["Dice", "Limbo", "Mines", "Plinko", "Crash", "Wheel"];

type Row = { id: number; who: string; game: string; mult: string; amt: string; win: boolean };

const make = (id: number): Row => {
  const win = Math.random() > 0.38;
  return {
    id, who: names[Math.floor(Math.random() * names.length)],
    game: games[Math.floor(Math.random() * games.length)],
    mult: (Math.random() * 6 + 1).toFixed(2),
    amt: (Math.random() * 480 + 4).toFixed(2), win,
  };
};

export default function LiveBets() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    setRows(Array.from({ length: 14 }, (_, i) => make(i)));
    let n = 100;
    const t = setInterval(() => setRows((r) => [make(n++), ...r].slice(0, 14)), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-l border-surface-line bg-[#080b10] px-4 py-4 xl:flex">
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pos shadow-[0_0_8px_#00e07a]" />
        Live bets
        <span className="ml-auto text-[10px] font-bold text-ink-dim">1,284 online</span>
      </div>
      <div className="flex-1 overflow-hidden">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-2 border-b border-[#10161f] py-1.5 text-[11px]">
            <span className="grid h-5 w-5 place-items-center rounded bg-[#2b4a6d] text-[9px] font-bold text-white">
              {r.who[0].toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink-muted">{r.who}</p>
              <p className="text-[10px] text-ink-dim">{r.game} · {r.mult}×</p>
            </div>
            <span className={`ml-auto font-bold num ${r.win ? "text-pos" : "text-neg"}`}>
              {r.win ? "+" : "−"}${r.amt}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}