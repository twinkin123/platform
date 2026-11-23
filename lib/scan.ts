import { sql } from "./db";

export type Token = {
  mint: string; ticker: string; name: string | null; state: "new" | "filled" | "migrating" | "dead";
  mcapUsd: string | null; liqUsd: string | null; holders: number | null;
  top10Pct: string | null; devPct: string | null; firstSeen: Date;
};

export const getTokens = () =>
  sql<Token[]>`select * from scan.tokens where state <> 'dead' order by first_seen desc limit 60`;
