"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Coins, Key, Map as MapIcon, Flame, Dices, Backpack,
  ArrowUpRight, ArrowDownLeft, Send, Users, Volume2,
} from "lucide-react";

const Town = dynamic(() => import("@/components/ville/Town"), { ssr: false });

const channels = ["All", "Local", "Trade", "Help", "Guild", "Casino", "Pulse", "System"];

const chat = [
  { who: "mika", hue: "#c58bff", text: "anyone selling snow boots at the market?" },
  { who: "drev", hue: "#7fd6a2", text: "stalls by the fountain, 40 SL$" },
  { who: "mika", hue: "#c58bff", text: "ty, on my way" },
  { who: "tobi", hue: "#ffc46b", text: "races start in 10, casino floor is packed" },
  { who: "you", hue: "#8b5cf6", text: "just landed, heading over" },
];

const people = [
  { name: "mika", hue: "#c58bff", at: "Market" },
  { name: "drev", hue: "#7fd6a2", at: "Fountain" },
  { name: "tobi", hue: "#ffc46b", at: "Casino" },
  { name: "wren", hue: "#7fb6ff", at: "North Gate" },
  { name: "ash", hue: "#ff9ab5", at: "Casino" },
];

const hotbar = [
  { Icon: Coins, key: "1" },
  { Icon: Key, key: "2" },
  { Icon: MapIcon, key: "3" },
  { Icon: Flame, key: "4" },
  { Icon: Dices, key: "5" },
  { Icon: Backpack, key: "6" },
];

const controls = [
  ["W A S D", "Move"],
  ["Space", "Jump"],
  ["E", "Interact"],
  ["M", "Map"],
];

export default function Ville() {
  const [tab, setTab] = useState(0);
  const [slot, setSlot] = useState(0);
  const [msg, setMsg] = useState("");

  return (
    <div className="relative h-[calc(100dvh-76px)] w-full overflow-hidden bg-[#080c16]">
      <Town />

      <div className="pointer-events-none absolute inset-0 p-4">
        <div className="flex items-start justify-between">
          <div className="rounded-xl border border-white/15 bg-black/55 px-4 py-2.5 backdrop-blur">
            <p className="text-[15px] font-extrabold tracking-tight text-white">Sable Square</p>
            <p className="text-[11.5px] font-semibold text-[#9aa4b8]">Sunny 24C | 128 online</p>
          </div>

          <div className="pointer-events-auto w-[228px] rounded-xl border border-white/15 bg-black/55 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
              <Users size={14} className="text-[#9aa4b8]" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#c3cbd9]">People</span>
              <span className="ml-auto text-[11px] font-bold text-[#7fd6a2]">5 here</span>
            </div>
            <div className="p-1.5">
              {people.map((p) => (
                <div key={p.name} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/5">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.hue }} />
                  <span className="text-[12.5px] font-bold text-white">{p.name}</span>
                  <span className="ml-auto text-[11px] font-semibold text-[#7c8698]">{p.at}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 w-[380px] pointer-events-auto">
          <div className="overflow-hidden rounded-xl border border-[#3d3421] bg-[#efe6d0] shadow-2xl">
            <div className="flex items-center gap-1 border-b border-[#d8ccb0] bg-[#e4d9bf] px-2 py-1.5">
              {channels.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setTab(i)}
                  className={
                    "rounded px-2 py-1 text-[10.5px] font-black " +
                    (i === tab ? "bg-[#3a2f18] text-[#f6eed9]" : "text-[#6b5c3d] hover:bg-[#d8ccb0]")
                  }
                >
                  {c}
                </button>
              ))}
              <Volume2 size={13} className="ml-auto text-[#6b5c3d]" />
            </div>
            <div className="h-[132px] space-y-1 overflow-y-auto px-3 py-2">
              {chat.map((m, i) => (
                <p key={i} className="text-[12.5px] leading-snug text-[#3a3021]">
                  <span className="font-black" style={{ color: m.hue === "#8b5cf6" ? "#6d3fe0" : m.hue }}>
                    {m.who}
                  </span>
                  <span className="text-[#6b5c3d]">: </span>
                  {m.text}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-[#d8ccb0] bg-[#e4d9bf] px-3 py-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Press Enter to chat"
                className="min-w-0 flex-1 bg-transparent text-[12.5px] font-semibold text-[#3a3021] outline-none placeholder:text-[#9a8a68]"
              />
              <button className="grid h-6 w-6 place-items-center rounded bg-[#3a2f18] text-[#f6eed9]">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="flex gap-1.5 rounded-xl border border-white/15 bg-black/55 p-1.5 backdrop-blur">
            {hotbar.map(({ Icon, key }, i) => (
              <button
                key={key}
                onClick={() => setSlot(i)}
                className={
                  "relative grid h-12 w-12 place-items-center rounded-lg border transition " +
                  (i === slot
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white"
                    : "border-white/10 bg-white/5 text-[#aab3c2] hover:bg-white/10")
                }
              >
                <Icon size={19} />
                <span className="absolute bottom-0.5 right-1 text-[9px] font-black text-white/50">{key}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 right-4 w-[210px] space-y-2 pointer-events-auto">
          <div className="rounded-xl border border-white/15 bg-black/55 p-2.5 backdrop-blur">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#8b95a8]">Controls</p>
            {controls.map(([k, a]) => (
              <div key={a} className="flex items-center gap-2 py-0.5">
                <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] font-black text-white">{k}</kbd>
                <span className="text-[11.5px] font-semibold text-[#c3cbd9]">{a}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2f9e63] text-[12.5px] font-extrabold text-white hover:bg-[#37b371]">
              <ArrowUpRight size={14} /> Buy
            </button>
            <button className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#c0453f] text-[12.5px] font-extrabold text-white hover:bg-[#d1524b]">
              <ArrowDownLeft size={14} /> Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}