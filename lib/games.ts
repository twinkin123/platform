export type GameId = "dice" | "limbo" | "mines" | "plinko" | "crash" | "wheel" | "coinflip" | "keno";

export type Game = {
  id: GameId;
  name: string;
  blurb: string;
  chance: number;
  multiplier: number;
  hue: string;
  art: string;
  tag: "hot" | "new" | "edge";
};

const make = (id: GameId, name: string, chance: number, hue: string, blurb: string, tag: Game["tag"] = "edge"): Game => ({
  id, name, chance, hue, blurb, tag, art: `/games/${id}.webp`, multiplier: Number((0.99 / chance).toFixed(4)),
});

export const GAMES: Game[] = [
  make("dice", "Dice", 0.495, "#7b5cff", "Pick a side, roll, settle.", "hot"),
  make("limbo", "Limbo", 0.495, "#00e07a", "Set a target, one spin.", "new"),
  make("mines", "Mines", 0.51, "#ffb020", "Reveal tiles, cash out early."),
  make("plinko", "Plinko", 0.5, "#4d9dff", "Drop and ride the curve.", "hot"),
  make("crash", "Crash", 0.515, "#ff4d5e", "Cash out before it breaks."),
  make("wheel", "Wheel", 0.505, "#ff77c8", "Sixteen segments, one pointer."),
  make("coinflip", "Coinflip", 0.5, "#ffd84d", "Heads or tails, nothing else."),
  make("keno", "Keno", 0.52, "#8fe9bf", "Pick numbers, draw ten."),
];

export const gameById = (id: string) => GAMES.find((g) => g.id === id);