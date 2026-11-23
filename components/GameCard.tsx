import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/casino/${game.id}`} className="group w-[196px] shrink-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#23232e] bg-[#101017]">
        <Image src={game.art} alt="" fill sizes="196px"
          className="object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 grid h-[34px] place-items-center" style={{ background: game.hue }}>
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white">{game.name}</span>
        </div>
        <div className="absolute inset-x-3 bottom-2.5">
          <p className="text-[15px] font-black">{game.name}</p>
          <p className="mt-0.5 text-[10.5px] text-white/60">{(game.chance * 100).toFixed(1)}% · {game.multiplier.toFixed(2)}×</p>
        </div>
      </div>
    </Link>
  );
}