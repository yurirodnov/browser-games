import { ImagesLoader } from "./lib/ImagesLoader";
import type { BricksAssets, GameAssets, GameConstants, PicsAssets } from "./types/types";
import { Game } from "./entities/Game";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<canvas id="canvas"></canvas>`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("No 2D context");
}

const gameConstants: GameConstants = {
  brickSize: 30,
  infoBoardSize: 100,
};

canvas.width = gameConstants.brickSize * 10 + gameConstants.infoBoardSize;
canvas.height = gameConstants.brickSize * 17;

const main = async () => {
  await Promise.all([
    ImagesLoader.loadAsset("brick_red", "assets/pics/brick_red.png"),
    ImagesLoader.loadAsset("brick_green", "assets/pics/brick_green.png"),
    ImagesLoader.loadAsset("brick_blue", "assets/pics/brick_blue.png"),
    ImagesLoader.loadAsset("brick_yellow", "assets/pics/brick_yellow.png"),
    ImagesLoader.loadAsset("brick_purple", "assets/pics/brick_purple.png"),
    ImagesLoader.loadAsset("brick_orange", "assets/pics/brick_orange.png"),
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
  };

  const gameAssets: GameAssets = {
    picsAssets: picsAssets,
  };

  new Game(gameAssets, gameConstants, ctx);
};

main();
