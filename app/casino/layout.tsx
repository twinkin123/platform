import Sidebar from "@/components/Sidebar";

export default function CasinoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1600px]">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}