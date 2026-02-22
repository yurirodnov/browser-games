// 01_space_invasion/src/main.ts

import { AssetsLoader } from "./utils/AssetsLoader";
import type { Assets, Constants } from "./types/types";
import { Game } from "./entities/Game";

// set game constants

const constants: Constants = {
  canvasWidth: 400,
  canvasHeight: 600,
};
// const WIDTH = 400;
// const HEIGHT = 600;

// init DOM elements
document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}
canvas.width = constants.canvasWidth;
canvas.height = constants.canvasHeight;

// create init function
const main = async () => {
  // load assets into memory
  await Promise.all([
    AssetsLoader.loadAsset("background", "assets/background.jpg"),
    AssetsLoader.loadAsset("spaceship", "assets/spaceship.png"),
  ]);

  // create assets object
  const assets: Assets = {
    background: AssetsLoader.getAsset("background"),
    spaceship: AssetsLoader.getAsset("spaceship"),
  };

  // create game instance
  const game = new Game(ctx, assets, constants);
  game.start();
};

// call init function
main();
