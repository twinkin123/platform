import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing ? check .env");

  const sql = postgres(url, {
    max: 1,
    ssl: url.includes(".railway.internal") ? undefined : { rejectUnauthorized: false },
  });

  await sql`create table if not exists _migrations (name text primary key, at timestamptz default now())`;
  const done = new Set((await sql`select name from _migrations`).map((r) => r.name));

  const files = (await readdir("db/migrations")).filter((f) => f.endsWith(".sql")).sort();
  if (!files.length) throw new Error("no .sql files in db/migrations");

  for (const file of files) {
    if (done.has(file)) continue;
    console.log("applying", file);
    await sql.unsafe(await readFile(`db/migrations/${file}`, "utf8"));
    await sql`insert into _migrations (name) values (${file})`;
  }

  await sql.end();
  console.log("done");
}

main().catch((e) => { console.error(e.message); process.exit(1); });
