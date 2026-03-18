// 003_snake/src/main.ts

import type { Assets, Constants } from "./types/types";
import { Game } from "./entities/Game";
import { AssetsLoader } from "./lib/AssetsLoader";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>
`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}

export const constants: Constants = {
  tileSize: 40,
  canvasColumns: 13,
  canvasRows: 16,
};

canvas.width = constants.tileSize * constants.canvasColumns;
canvas.height = constants.tileSize * constants.canvasRows;

const main = async () => {
  await Promise.all([
    AssetsLoader.loadAsset("tileDark", "assets/tile-dark.png"),
    AssetsLoader.loadAsset("tileLight", "assets/tile-light.png"),
    AssetsLoader.loadAsset("snakeBody", "assets/snake.png"),
    AssetsLoader.loadAsset("snakeHeadTop", "assets/snake-head.png"),
    AssetsLoader.loadAsset("snakeHeadRight", "assets/snake-head-right.png"),
    AssetsLoader.loadAsset("snakeHeadDown", "assets/snake-head-down.png"),
    AssetsLoader.loadAsset("snakeHeadLeft", "assets/snake-head-left.png"),
    AssetsLoader.loadAsset("apple", "assets/apple2.png"),
    AssetsLoader.loadAsset("shit", "assets/shit.png"),
  ]);

  const assets: Assets = {
    tileDark: AssetsLoader.getAsset("tileDark"),
    tileLight: AssetsLoader.getAsset("tileLight"),
    snakeBody: AssetsLoader.getAsset("snakeBody"),
    snakeHeadUp: AssetsLoader.getAsset("snakeHeadTop"),
    snakeHeadRight: AssetsLoader.getAsset("snakeHeadRight"),
    snakeHeadDown: AssetsLoader.getAsset("snakeHeadDown"),
    snakeHeadLeft: AssetsLoader.getAsset("snakeHeadLeft"),
    apple: AssetsLoader.getAsset("apple"),
    shit: AssetsLoader.getAsset("shit"),
  };

  const game = new Game(ctx, assets, constants);
  game.checkField();
};

main();
