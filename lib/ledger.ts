import { sql } from "./db";

export async function accountFor(userId: string) {
  const [a] = await sql<{ id: string }[]>`
    select id from core.accounts where user_id = ${userId} and kind = 'user_real' limit 1`;
  return a.id;
}

export async function balance(accountId: string) {
  const [r] = await sql<{ net: string }[]>`
    select coalesce((select sum(delta) from ledger.entries where account_id = ${accountId}), 0)
         - coalesce((select sum(amount) from ledger.holds where account_id = ${accountId} and not released), 0) as net`;
  return Number(r.net);
}

export async function demoUser() {
  const email = "demo@sable.local";
  const [existing] = await sql<{ id: string }[]>`select id from core.users where email = ${email}`;
  if (existing) return existing.id;

  const [user] = await sql<{ id: string }[]>`
    insert into core.users (email) values (${email}) returning id`;
  const [acct] = await sql<{ id: string }[]>`
    insert into core.accounts (user_id, kind) values (${user.id}, 'user_real') returning id`;
  await sql`insert into ledger.entries (account_id, delta, ref, idempotency_key)
            values (${acct.id}, 500, 'seed', ${"seed:" + user.id})`;
  return user.id;
}
