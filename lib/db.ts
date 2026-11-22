import postgres from "postgres";

const url = process.env.DATABASE_URL!;
const internal = url.includes(".railway.internal");

export const sql = postgres(url, {
  transform: postgres.camel,
  ssl: internal ? undefined : { rejectUnauthorized: false },
  max: 10,
});
