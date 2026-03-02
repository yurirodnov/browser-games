// 02_flappy_birds/src/main.ts

import { AssetsLoader } from "./lib/AssetsLoader";
import type { Assets, Constants } from "./types/types";
import { Game } from "./entities/Game";

import "./style.css";

const constants: Constants = {
  canvasWidth: 480,
  canvasHeight: 680,
  dayDurationMs: 15_000,
  nightDurationMs: 15_000,
  baseHeight: 120,
  birdSpawnX: 50,
  birdSpawnY: 320,
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}
canvas.width = constants.canvasWidth;
canvas.height = constants.canvasHeight;

const main = async () => {
  await Promise.all([
    AssetsLoader.loadAsset(
      "backgroundDay",
      "assets/sprites/background-day.png",
    ),
    AssetsLoader.loadAsset(
      "backgroundNight",
      "assets/sprites/background-night.png",
    ),
    AssetsLoader.loadAsset("base", "assets/sprites/base.png"),
    AssetsLoader.loadAsset("birdUP", "assets/sprites/yellowbird-upflap.png"),
    AssetsLoader.loadAsset("birdMID", "assets/sprites/yellowbird-midflap.png"),
    AssetsLoader.loadAsset(
      "birdDOWN",
      "assets/sprites/yellowbird-downflap.png",
    ),
  ]);

  const assets: Assets = {
    backgroundDay: AssetsLoader.getAsset("backgroundDay"),
    backgroundNight: AssetsLoader.getAsset("backgroundNight"),
    base: AssetsLoader.getAsset("base"),
    birdUP: AssetsLoader.getAsset("birdUP"),
    birdMID: AssetsLoader.getAsset("birdMID"),
    birdDOWN: AssetsLoader.getAsset("birdDOWN"),
  };

  const game = new Game(ctx, assets, constants);
  game.start();
};

main();
