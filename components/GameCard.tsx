import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/casino/${game.id}`} className="group w-[176px] shrink-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#23232e] bg-[#101017] transition duration-200 group-hover:-translate-y-1 group-hover:border-white/25">
        <Image src={game.art} alt="" fill sizes="176px"
          className="object-cover brightness-95 transition duration-300 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] from-12% via-[#08080b]/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 grid h-[32px] place-items-center" style={{ background: game.hue }}>
          <span className="text-[10.5px] font-black uppercase tracking-[0.16em] text-white">{game.name}</span>
        </div>
        <div className="absolute inset-x-3 bottom-2.5">
          <p className="text-[14px] font-black">{game.name}</p>
          <p className="mt-0.5 text-[10px] text-white/55">{(game.chance * 100).toFixed(1)}% · {game.multiplier.toFixed(2)}×</p>
        </div>
      </div>
    </Link>
  );
}