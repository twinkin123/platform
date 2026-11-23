"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["Casino", "/casino"],
  ["Ville", "/ville"],
  ["Pulse", "/pulse"],
];

export default function Heads() {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {items.map(([label, href]) => {
        const on = path.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`rounded-md px-5 py-2 text-[15px] font-extrabold transition ${
              on ? "bg-[#8b5cf6] text-white" : "text-[#c9c9d8] hover:bg-[#1d1d21]"
            }`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}