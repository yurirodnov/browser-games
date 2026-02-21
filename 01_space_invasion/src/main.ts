// 01_space_invasion/src/main.ts

import { AssetsLoader } from "./utils/assetsLoader";
import { Background } from "./entities/background";

// set game constants
const WIDTH = 400;
const HEIGHT = 600;

// Get app element and set canvas
document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}
canvas.width = WIDTH;
canvas.height = HEIGHT;

// init entities
let background: Background;

// create init function
const init = async () => {
  // async load assets
  await Promise.all([
    AssetsLoader.loadAsset("background", "assets/background.jpg"),
  ]);

  // create entities
  background = new Background(0, 0, WIDTH, HEIGHT, "background");

  // set handlers and listeners

  // start game loop
  gameLoop();
};

const gameLoop = () => {
  // clear screen
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // update logic

  // update screen
  background.draw(ctx);

  // call gameLoop endlessly
  requestAnimationFrame(gameLoop);
};

// call init function
init();
