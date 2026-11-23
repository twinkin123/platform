"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const CHANNELS = ["ALL", "GAME", "PARTY", "GUILD"];

export default function VilleHud() {
  const [tab, setTab] = useState("ALL");
  const [log, setLog] = useState<string[]>([
    "<b>Welcome to Sable.</b> 3 players nearby.",
    "<b>moss:</b> gg last round",
    "<b>juno:</b> anyone at the fountain?",
  ]);
  const [draft, setDraft] = useState("");
  const [slot, setSlot] = useState<number | null>(null);
  const map = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = map.current;
    if (!c) return;
    const x = c.getContext("2d");
    if (!x) return;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      x.fillStyle = "#241f14";
      x.fillRect(0, 0, 132, 92);
      x.strokeStyle = "#3b3324";
      x.lineWidth = 1;
      for (let i = 0; i <= 6; i++) {
        x.beginPath(); x.moveTo(i * 22, 0); x.lineTo(i * 22, 92); x.stroke();
        x.beginPath(); x.moveTo(0, i * 15); x.lineTo(132, i * 15); x.stroke();
      }
      x.fillStyle = "#6b4f2a";
      x.fillRect(56, 6, 20, 14);
      x.fillStyle = "#4a3c26";
      [[18, 30], [96, 30], [30, 64], [100, 66]].forEach(([bx, by]) => x.fillRect(bx, by, 12, 10));
      x.fillStyle = "#e8d8a8";
      x.beginPath();
      x.arc(66, 52, 3, 0, 6.3);
      x.fill();
      x.strokeStyle = "#ffe9a8";
      x.stroke();
      x.fillStyle = "#c9b68a";
      x.font = "bold 8px Inter";
      x.textAlign = "center";
      x.fillText("N", 66, 10);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const send = () => {
    if (!draft.trim()) return;
    setLog((l) => [...l.slice(-7), `<b>sable:</b> ${draft.trim()}`]);
    setDraft("");
  };

  return (
    <div className="pointer-events-none absolute inset-0 select-none font-sans text-[10px] text-[#e9e2cf]">
      <div className="pointer-events-auto absolute left-2 top-2 w-[136px] overflow-hidden rounded-md border-2 border-[#6b5233] bg-[#241f14] shadow-lg">
        <div className="flex items-center justify-between bg-[#3a3020] px-1.5 py-0.5 text-[8.5px] font-extrabold tracking-wider text-[#e0c98f]">
          <span>SABLE</span>
          <span>PLAZA</span>
        </div>
        <canvas ref={map} width={132} height={92} className="block" />
        <div className="flex justify-between bg-[#2c2418] px-1 py-0.5 text-[8px] text-[#c9b68a]">
          <span>lvl 12</span>
          <span>3 online</span>
        </div>
      </div>

      <div className="pointer-events-auto absolute left-2 top-[152px] flex flex-col gap-1">
        <Link href="/casino" className="rounded border border-[#3a2f1c] bg-[#1a1510dd] px-2 py-1 text-[9.5px] font-bold text-[#d8c9a4]">Casino</Link>
        <Link href="/pulse" className="rounded border border-[#3a2f1c] bg-[#1a1510dd] px-2 py-1 text-[9.5px] font-bold text-[#d8c9a4]">Pulse</Link>
      </div>

      <div className="pointer-events-auto absolute right-2 top-2 w-[140px] overflow-hidden parch">
        <div className="parch-hd flex items-center justify-between px-1.5 py-1">
          <span>People</span>
          <span>3</span>
        </div>
        {["sable", "moss", "juno"].map((n) => (
          <div key={n} className="flex items-center gap-1 border-b border-[#d8c49a] px-1.5 py-[3px] text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2fa84f]" />
            {n}
          </div>
        ))}
      </div>

      <div className="pointer-events-auto absolute bottom-2 left-2 w-[268px] overflow-hidden parch">
        <div className="flex">
          {CHANNELS.map((c) => (
            <button key={c} onClick={() => setTab(c)}
              className={`flex-1 border-r border-[#a8895c] py-1 text-[8.5px] font-extrabold last:border-r-0 ${
                tab === c ? "bg-[#f0e3c4] text-[#2a1f10]" : "bg-[#d9c49b] text-[#5c4526]"
              }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="h-[104px] overflow-hidden px-1.5 py-1 text-[9.5px] leading-[1.5]">
          {log.map((l, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: l }} />
          ))}
        </div>
        <div className="flex gap-1 border-t border-[#a8895c] bg-[#e8d8b6] p-[3px]">
          <input value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Say something..."
            className="flex-1 rounded-sm border border-[#bda37a] bg-[#fffdf6] px-1 py-[2px] text-[9px] text-[#3a2c18] outline-none" />
          <button onClick={send} className="parch-btn px-1.5">Send</button>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-2 right-2 flex flex-col items-end gap-1">
        <div className="flex gap-1">
          {["coin", "dice", "lantern", "fish"].map((it, i) => (
            <button key={it} onClick={() => setSlot(i)}
              className={`grid h-9 w-9 place-items-center rounded border-2 bg-[#1a1510cc] text-[13px] ${
                slot === i ? "border-[#e8c877]" : "border-[#6b5233]"
              }`}>
              {["o", "4", "L", "~"][i]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8.5px] font-extrabold text-[#f0e4c6]">SMITHING</span>
          <span className="text-[8.5px] text-[#cfc3a5]">68 / 100</span>
        </div>
        <div className="h-[7px] w-[190px] overflow-hidden rounded border border-[#4a3c26] bg-black/60">
          <div className="h-full w-[68%] bg-gradient-to-r from-[#e0b13a] to-[#f7e08a]" />
        </div>
      </div>

      <div className="absolute bottom-[52px] left-1/2 -translate-x-1/2 text-[9px] text-[#cfc3a5] opacity-80">
        Drag to orbit / wheel to zoom / WASD to walk
      </div>
    </div>
  );
}