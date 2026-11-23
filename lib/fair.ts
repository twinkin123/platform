import { createHash, createHmac, randomBytes } from "node:crypto";

export const newServerSeed = () => randomBytes(32).toString("hex");
export const hashSeed = (seed: string) => createHash("sha256").update(seed).digest("hex");

export function roll(serverSeed: string, clientSeed: string, nonce: number) {
  const h = createHmac("sha256", serverSeed).update(`${clientSeed}:${nonce}`).digest("hex");
  return parseInt(h.slice(0, 13), 16) / 2 ** 52;
}
