import Image from "next/image";

export default function Banner({ src, label, title, sub }: {
  src: string; label: string; title: string; sub: string;
}) {
  return (
    <div className="relative h-[196px] overflow-hidden rounded-xl border border-[#26262e]">
      <Image src={src} alt="" fill sizes="33vw" className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      <span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-[#0a0a0d]/85 px-2 py-1 text-[10.5px] font-bold text-white">
        <span className="grid h-3 w-3 place-items-center rounded-sm bg-[#8b5cf6] text-[7px]">+</span>
        {label}
      </span>
      <div className="absolute inset-x-3 bottom-3">
        <p className="whitespace-pre-line text-[24px] font-black uppercase leading-[1.02] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{title}</p>
        <p className="mt-1.5 text-[11.5px] leading-snug text-white/85">{sub}</p>
      </div>
    </div>
  );
}