// 003_snake/src/main.ts

import type { Assets, Constants } from "./types/types";
import { Game } from "./entities/Game";
import "./style.css";
import { AssetsLoader } from "./lib/AssetsLoader";

document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>
`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}

const constants: Constants = {
  tileSize: 30,
  canvasColumns: 20,
  canvasRows: 20,
};

canvas.width = constants.tileSize * constants.canvasColumns;
canvas.height = constants.tileSize * constants.canvasRows;

const main = async () => {
  await Promise.all([
    AssetsLoader.loadAsset("background", "assets/grass.jpg"),
    AssetsLoader.loadAsset("snakeBody", "assets/snake.png"),
    AssetsLoader.loadAsset("snakeHeadTop", "assets/snake-head.png"),
    AssetsLoader.loadAsset("snakeHeadRight", "assets/snake-head-right.png"),
    AssetsLoader.loadAsset("snakeHeadDown", "assets/snake-head-down.png"),
    AssetsLoader.loadAsset("snakeHeadLeft", "assets/snake-head-left.png"),
  ]);

  const assets: Assets = {
    background: AssetsLoader.getAsset("background"),
    snakeBody: AssetsLoader.getAsset("snakeBody"),
    snakeHeadTop: AssetsLoader.getAsset("snakeHeadTop"),
    snakeHeadRight: AssetsLoader.getAsset("snakeHeadRight"),
    snakeHeadDown: AssetsLoader.getAsset("snakeHeadDown"),
    snakeHeadLeft: AssetsLoader.getAsset("snakeHeadLeft"),
  };

  const game = new Game(ctx, assets, constants);
  game.checkField();
};

main();
