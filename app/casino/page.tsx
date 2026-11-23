import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, ArrowRight } from "lucide-react";
import GameCard from "@/components/GameCard";
import { GAMES, type Game } from "@/lib/games";

const tabs = ["All", "Originals", "Slots", "Live", "Challenges"];

const byId = (id: string) => GAMES.find((g) => g.id === id) as Game;

const originals = ["mines", "limbo", "coinflip", "plinko", "dice", "crash"].map(byId);
const slots = ["keno", "wheel", "crash", "dice", "limbo", "mines"].map(byId);

function Rail({ title, list }: { title: string; list: Game[] }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-end">
        <h2 className="text-[22px] font-black tracking-[-0.02em] text-white">{title}</h2>
        <Link href="/casino" className="ml-auto text-[13.5px] font-bold text-[#a78bff] hover:text-white">
          View all
        </Link>
      </div>
      <div className="flex gap-3.5 overflow-hidden">
        {list.map((g) => (
          <GameCard key={`${title}-${g.id}`} game={g} />
        ))}
      </div>
    </section>
  );
}

export default function Lobby() {
  return (
    <>
      <div className="flex-1 px-6 pt-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="relative h-[236px] overflow-hidden rounded-2xl border border-[#202029]">
            <Image src="/banners/1.webp" alt="" fill sizes="1200px" priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-black/45" />
            <div className="absolute inset-y-0 right-8 hidden w-[320px] -rotate-6 items-center sm:flex">
              <div className="w-full rounded-xl border border-white/15 bg-[#0d0d13]/90 p-3 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-[#7c5cff] text-[12px] font-black text-white">
                    S
                  </span>
                  <span className="text-[13px] font-black tracking-tight text-white">SHUFFLE</span>
                  <span className="ml-auto rounded bg-[#7c5cff] px-1.5 py-0.5 text-[8px] font-black text-white">
                    VIP
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                  {["/games/dice.webp", "/games/plinko.webp", "/games/wheel.webp"].map((src) => (
                    <div key={src} className="relative aspect-square overflow-hidden rounded-md">
                      <Image src={src} alt="" fill sizes="90px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#26262f]">
                  <div className="h-full w-[62%] rounded-full bg-[#7c5cff]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#202029] bg-[#101016] p-5">
            <span className="inline-block rounded-md bg-[#7c5cff] px-2 py-1 text-[10.5px] font-black tracking-wide text-white">
              NEW
            </span>
            <h3 className="mt-3 text-[27px] font-black leading-[1.05] tracking-[-0.03em] text-white">
              Daily Races
            </h3>
            <p className="mt-1.5 text-[14.5px] font-semibold text-[#9a9aa8]">SL$ 25,000 Up For Grabs</p>
            <ArrowRight size={18} className="absolute bottom-5 right-5 text-[#6f6f7d]" />
          </div>
        </div>

        <div className="mt-5 flex items-center border-b border-[#17171c]">
          <div className="flex items-center gap-1 text-[14px] font-extrabold">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={
                  "px-3.5 pb-3.5 pt-1 transition " +
                  (i === 0
                    ? "border-b-[3px] border-[#7c5cff] text-white"
                    : "border-b-[3px] border-transparent text-[#8b8b98] hover:text-white")
                }
              >
                {t}
              </button>
            ))}
            <button className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-[#202029] bg-[#101016] text-[#9a9aa8]">
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="ml-auto mb-2.5 flex h-11 w-[300px] items-center gap-2.5 rounded-xl border border-[#202029] bg-[#0f0f14] px-3.5">
            <Search size={16} className="text-[#6f6f7d]" />
            <span className="text-[13.5px] font-semibold text-[#6f6f7d]">Search</span>
            <span className="ml-auto flex items-center gap-1.5 text-[12px] font-bold text-[#5d5d6b]">
              <span>&amp;</span>
              <kbd className="rounded border border-[#2a2a36] px-1.5 py-0.5">Ctrl</kbd>
              <kbd className="rounded border border-[#2a2a36] px-1.5 py-0.5">K</kbd>
            </span>
          </div>
        </div>

        <div className="mt-5">
          <Rail title="Originals" list={originals} />
          <Rail title="Slots" list={slots} />
        </div>
      </div>

      <footer className="border-t border-[#17171c] px-6 py-4">
        <div className="flex items-center gap-5 text-[13.5px] font-semibold text-[#9a9aa8]">
          <Link href="/" className="hover:text-white">About</Link>
          <Link href="/" className="hover:text-white">Terms</Link>
          <Link href="/" className="hover:text-white">Privacy</Link>
          <Link href="/" className="hover:text-white">Support</Link>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e8e8ef] text-[9px] font-black text-black">
            18+
          </span>
        </div>
        <p className="mt-1.5 text-[12px] text-[#5d5d6b]">
          Licensed by SHUFFLE Software. All rights reserved.
        </p>
      </footer>
    </>
  );
}