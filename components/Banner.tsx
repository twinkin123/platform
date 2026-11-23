import Image from "next/image";

export default function Banner({ src, tag, title, cta, tint }: {
  src: string; tag: string; title: string; cta: string; tint: string;
}) {
  return (
    <div className="relative h-[190px] overflow-hidden rounded-xl border border-white/10">
      <Image src={src} alt="" fill sizes="33vw" className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <p className="text-[11px] font-black tracking-[0.14em]" style={{ color: tint }}>{tag}</p>
        <p className="mt-1 text-[19px] font-black leading-[1.1]">{title}</p>
        <button className="mt-2 h-7 self-start rounded-md px-3.5 text-[11.5px] font-extrabold text-white" style={{ background: tint }}>
          {cta}
        </button>
      </div>
    </div>
  );
}