import "dotenv/config";
import postgres from "postgres";

const T = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const names = ["proto", "labs", "dao", "club", "coin", "pad", "net", "verse", "x", "ai"];

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false }, max: 1 });
  await sql`truncate scan.tokens`;
  const states = ["new", "new", "new", "new", "filled", "filled", "migrating"];

  for (let i = 0; i < 60; i++) {
    let ticker = "";
    for (let k = 0; k < 4 + (i % 4); k++) ticker += T[(i * 7 + k * 3) % T.length];
    const state = states[i % states.length];
    const mint = `${Math.random().toString(36).slice(2, 10)}pump`;
    await sql`insert into scan.tokens (mint, ticker, name, state, mcap_usd, liq_usd, holders, top10_pct, dev_pct)
      values (${mint}, ${ticker}, ${ticker.toLowerCase() + " " + names[i % names.length]}, ${state},
        ${(Math.random() * 90000 + 9000).toFixed(2)}, ${(Math.random() * 20000 + 2000).toFixed(2)},
        ${Math.floor(Math.random() * 900 + 40)}, ${(Math.random() * 40 + 12).toFixed(1)}, ${(Math.random() * 14 + 1).toFixed(1)})`;
  }
  await sql.end();
  console.log("seeded 60");
}
main();