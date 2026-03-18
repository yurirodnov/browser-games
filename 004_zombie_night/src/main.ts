import type { Assets, Constants } from "./types/type";
import { Game } from "./entitites/Game";
import { AssetsLoader } from "./lib/AssetsLoader";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}

const constants: Constants = {
  tileSize: 60,
};

canvas.width = constants.tileSize * 18;
canvas.height = constants.tileSize * 8;

export const main = async () => {
  await Promise.all([AssetsLoader.loadAsset("ground", "assets/ground.png")]);
  const assets: Assets = {
    ground: AssetsLoader.getAsset("ground"),
  };

  const game = new Game(ctx, assets, constants);
};

main();
