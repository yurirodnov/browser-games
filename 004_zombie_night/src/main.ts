import type { Assets, Constants } from "./types/type";
import { Game } from "./entitites/Game";

document.querySelector<HTMLDivElement>("app")!.innerHTML =
  `<div id="canvas"></div>`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}

const constants: Constants = {
  tileSize: 40,
};

import "./style.css";
import { AssetsLoader } from "./lib/AssetsLoader";

export const main = async () => {
  await Promise.all([AssetsLoader.loadAsset("ground", "assets/ground.png")]);
  const assets: Assets = {
    ground: AssetsLoader.getAsset("ground"),
  };

  const game = new Game(ctx, assets, constants);
};

main();
