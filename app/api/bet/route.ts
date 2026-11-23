import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { accountFor, balance, demoUser } from "@/lib/ledger";
import { hashSeed, newServerSeed, roll } from "@/lib/fair";
import { gameById } from "@/lib/games";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const game = gameById(String(body.game ?? ""));
  const stake = Number(body.stake);

  if (!game) return NextResponse.json({ error: "unknown game" }, { status: 400 });
  if (!Number.isFinite(stake) || stake <= 0) return NextResponse.json({ error: "bad stake" }, { status: 400 });

  const userId = await demoUser();
  const accountId = await accountFor(userId);
  if ((await balance(accountId)) < stake) return NextResponse.json({ error: "insufficient" }, { status: 402 });

  const serverSeed = newServerSeed();
  const clientSeed = String(body.clientSeed ?? "sable").slice(0, 64);
  const nonce = Date.now();
  const r = roll(serverSeed, clientSeed, nonce);
  const win = r < game.chance;
  const payout = win ? Number((stake * game.multiplier).toFixed(8)) : 0;
  const key = `bet:${userId}:${nonce}`;

  const [bet] = await sql<{ id: string }[]>`
    insert into ledger.bets (user_id, game, stake, multiplier, payout, server_seed, seed_hash, client_seed, nonce)
    values (${userId}, ${game.id}, ${stake}, ${game.multiplier}, ${payout}, ${serverSeed}, ${hashSeed(serverSeed)}, ${clientSeed}, ${nonce})
    returning id`;

  await sql`insert into ledger.entries (account_id, delta, ref, idempotency_key)
            values (${accountId}, ${payout - stake}, ${"bet:" + bet.id}, ${key})`;

  return NextResponse.json({
    id: bet.id, win, roll: r, multiplier: game.multiplier, payout,
    balance: await balance(accountId),
    seedHash: hashSeed(serverSeed), serverSeed, nonce,
  });
}
