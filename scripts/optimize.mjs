import sharp from "sharp";
import { readdir, unlink } from "node:fs/promises";
import { join } from "node:path";

const jobs = [
  { dir: "public/banners", width: 1600, quality: 82 },
  { dir: "public/games", width: 640, quality: 84 },
];

for (const { dir, width, quality } of jobs) {
  for (const file of await readdir(dir)) {
    if (!file.endsWith(".png")) continue;
    const from = join(dir, file);
    const to = from.replace(/\.png$/, ".webp");
    await sharp(from).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(to);
    await unlink(from);
    console.log("done", to);
  }
}