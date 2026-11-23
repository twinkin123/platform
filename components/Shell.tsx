import Link from "next/link";
import { Home } from "lucide-react";
import Heads from "@/components/Heads";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col">
      <header className="flex h-[54px] shrink-0 items-center gap-3 bg-[#141416] px-3">
        <Link href="/casino" className="grid h-9 w-9 place-items-center rounded-md bg-[#1d1d21] text-[#b9b9c8] hover:bg-[#26262c]">
          <Home size={17} />
        </Link>
        <Heads />
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-md bg-[#1d1d21] px-3 py-1.5 text-[13px] font-extrabold text-[#c8b6ff] num">490.00 SL$</span>
          <button className="h-9 rounded-md border border-[#2b2b34] px-4 text-[13px] font-extrabold text-[#dcdce6] hover:bg-[#1d1d21]">Login</button>
          <button className="h-9 rounded-md bg-[#8b5cf6] px-4 text-[13px] font-extrabold text-white">Register</button>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      <footer className="flex h-[38px] shrink-0 items-center gap-4 bg-[#141416] px-4 text-[11.5px] text-[#8e8e9c]">
        <a href="#" className="hover:text-white">About</a>
        <a href="#" className="hover:text-white">Fairness</a>
        <a href="#" className="hover:text-white">Treasury</a>
        <a href="#" className="hover:text-white">Support</a>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded border border-[#2b2b34] px-2 py-0.5 text-[10.5px]">SL$ 1:1 USD</span>
          <span className="rounded border border-[#2b2b34] px-2 py-0.5 text-[10.5px]">18+</span>
        </div>
      </footer>
    </div>
  );
}