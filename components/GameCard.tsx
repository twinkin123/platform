import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/casino/${game.id}`} className="group block w-[240px] shrink-0">
      <div className="relative aspect-[240/258] overflow-hidden rounded-2xl border border-[#202029] bg-[#101017] transition duration-200 group-hover:-translate-y-1 group-hover:border-[#3a3a4a]">
        <Image
          src={game.art}
          alt=""
          fill
          sizes="240px"
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
        <p className="absolute inset-x-2 bottom-3 text-center text-[27px] font-black uppercase leading-none tracking-[-0.02em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          {game.name}
        </p>
      </div>
    </Link>
  );
}