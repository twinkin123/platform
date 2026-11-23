export default function Ville() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 py-10">
      <div className="w-full max-w-xl rounded-lg border border-surface-line bg-surface-card p-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">Town</p>
        <h1 className="mt-2 text-3xl font-extrabold">Sable Ville</h1>
        <p className="mt-2 text-sm text-ink-muted">
          The isometric plaza lands here next: cobbles, fountain, casino frontage, walkable avatars.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-left">
          {[["Plaza", "3 online"], ["Casino", "Enter"], ["Market", "2 stalls"]].map(([a, b]) => (
            <div key={a} className="rounded-md border border-surface-line bg-black/20 p-3">
              <p className="text-xs font-bold">{a}</p>
              <p className="text-[11px] text-ink-dim">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
