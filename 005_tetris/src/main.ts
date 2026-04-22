// 005_tetris/src/main.ts

import { ImagesLoader } from "./lib/ImagesLoader";
import type { BricksAssets, GameAssets, GameConstants, PicsAssets } from "./types/types";
import { Game } from "./entities/Game";
import "./style.css";

document.querySelector<HTMLDivElement>("#game")!.innerHTML = `<canvas id="game-canvas"></canvas>`;
const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const gameCtx = gameCanvas.getContext("2d");
if (!gameCtx) {
  throw new Error("No game 2D context");
}

document.querySelector<HTMLDivElement>("#hud")!.innerHTML = `<canvas id="hud-canvas"></canvas>`;
const hudCanvas = document.getElementById("hud-canvas") as HTMLCanvasElement;
const hudCtx = hudCanvas.getContext("2d");
if (!hudCtx) {
  throw new Error("No HUD 2D context!");
}

const gameConstants: GameConstants = {
  brickSize: 25,
};

gameCanvas.width = gameConstants.brickSize * 10;
gameCanvas.height = gameConstants.brickSize * 20;
hudCanvas.width = gameConstants.brickSize * 7;
hudCanvas.height = gameConstants.brickSize * 20;

const main = async () => {
  await Promise.all([
    ImagesLoader.loadAsset("brick_red", "assets/pics/brick_red.png"),
    ImagesLoader.loadAsset("brick_green", "assets/pics/brick_green.png"),
    ImagesLoader.loadAsset("brick_blue", "assets/pics/brick_blue.png"),
    ImagesLoader.loadAsset("brick_yellow", "assets/pics/brick_yellow.png"),
    ImagesLoader.loadAsset("brick_purple", "assets/pics/brick_purple.png"),
    ImagesLoader.loadAsset("brick_orange", "assets/pics/brick_orange.png"),
    ImagesLoader.loadAsset("background", "assets/pics/background.png"),
    ImagesLoader.loadAsset("hud", "assets/pics/hud.png"),
  ]);

  const brickAssets: BricksAssets = {
    red: ImagesLoader.getAsset("brick_red"),
    green: ImagesLoader.getAsset("brick_green"),
    blue: ImagesLoader.getAsset("brick_blue"),
    yellow: ImagesLoader.getAsset("brick_yellow"),
    purple: ImagesLoader.getAsset("brick_purple"),
    orange: ImagesLoader.getAsset("brick_orange"),
  };

  const picsAssets: PicsAssets = {
    bricks: brickAssets,
    background: ImagesLoader.getAsset("background"),
    HUD: ImagesLoader.getAsset("hud"),
  };

  const gameAssets: GameAssets = {
    picsAssets: picsAssets,
  };

  new Game(gameAssets, gameConstants, gameCtx, hudCtx);
};

main();
