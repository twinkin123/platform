"use client";
import { useState } from "react";
import Link from "next/link";

type Result = { win: boolean; roll: number; payout: number; balance: number; seedHash: string; nonce: number };

export default function Dice() {
  const [stake, setStake] = useState("10");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);
  const [balance, setBalance] = useState(500);

  async function play() {
    setBusy(true);
    const r = await fetch("/api/bet", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ game: "dice", stake: Number(stake) }),
    });
    const data = await r.json();
    setBusy(false);
    if (!r.ok) return;
    setRes(data);
    setBalance(data.balance);
    setHistory((h) => [data.win, ...h].slice(0, 14));
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/casino" className="grid h-9 w-9 place-items-center rounded-md border border-surface-line bg-surface-card">←</Link>
        <h1 className="text-2xl font-extrabold">Dice</h1>
        <span className="ml-auto rounded border border-lime/25 bg-lime/10 px-2 py-1 text-[11px] font-bold text-lime">1% edge · provably fair</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid min-h-[380px] place-items-center rounded-lg border border-surface-line bg-[radial-gradient(75%_85%_at_50%_30%,#131c2a,#080b11)]">
          <p className={`text-[92px] font-extrabold num ${res ? (res.win ? "text-pos" : "text-neg") : "text-ink/30"}`}>
            {res ? res.roll.toFixed(2) : "—"}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-surface-line bg-surface-card p-4">
          <label className="text-[11px] font-bold uppercase text-ink-muted">Stake</label>
          <input value={stake} onChange={(e) => setStake(e.target.value)}
            className="h-11 rounded-md border border-surface-line bg-black/30 px-3 text-base font-bold num outline-none focus:border-white/30" />
          <div className="flex gap-2">
            {[1, 5, 10, 25, 100].map((v) => (
              <button key={v} onClick={() => setStake(String(v))}
                className="h-8 flex-1 rounded border border-surface-line bg-white/[0.03] text-xs font-bold hover:bg-white/10">{v}</button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-ink-muted"><span>Win chance</span><b className="text-ink">49.50%</b></div>
          <div className="flex justify-between text-xs text-ink-muted"><span>Payout</span><b className="text-ink">2.00×</b></div>
          <button onClick={play} disabled={busy}
            className="h-12 rounded-md bg-lime text-sm font-extrabold text-[#0a1400] disabled:opacity-50">
            {busy ? "Rolling…" : "Roll"}
          </button>
          <div className="mt-auto border-t border-surface-line pt-3 text-xs text-ink-muted">
            Balance <b className="text-ink num">{balance.toFixed(2)}</b> SL$
          </div>
          <div className="flex flex-wrap gap-1">
            {history.map((w, i) => (
              <span key={i} className={`grid h-5 w-5 place-items-center rounded text-[10px] font-bold ${w ? "bg-pos/15 text-pos" : "bg-neg/15 text-neg"}`}>
                {w ? "W" : "L"}
              </span>
            ))}
          </div>
          {res && <p className="font-mono text-[10px] text-ink-dim">nonce {res.nonce} · hash {res.seedHash.slice(0, 16)}…</p>}
        </div>
      </div>
    </div>
  );
}