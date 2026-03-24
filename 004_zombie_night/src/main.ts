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
  playerWidth: 25,
  playerHeight: 50,
};

canvas.width = constants.tileSize * 18;
canvas.height = constants.tileSize * 8;

export const main = async () => {
  await Promise.all([
    AssetsLoader.loadAsset("ground", "assets/ground.png"),
    AssetsLoader.loadAsset("survivor", "assets/hero_shotgun_sketch.png"),
    AssetsLoader.loadAsset("background", "assets/background.png"),
  ]);
  const assets: Assets = {
    ground: AssetsLoader.getAsset("ground"),
    survivor: AssetsLoader.getAsset("survivor"),
    background: AssetsLoader.getAsset("background"),
  };

  const game = new Game(ctx, assets, constants);
};

main();
