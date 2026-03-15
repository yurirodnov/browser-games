import type { Assets, Constants } from "./types/types";
import "./style.css";
import { AssetsLoader } from "./lib/AssetsLoaders";

document.querySelector<HTMLDivElement>("#app")!.innerHTML =
  `<canvas id="canvas"></canvas>`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}

const constants: Constants = {
  canvasWidth: 800,
  canvasHeight: 600,
};

canvas.width = constants.canvasWidth;
canvas.height = constants.canvasHeight;

export const main = async () => {
  await Promise.all([
    AssetsLoader.loadAsset("background", "assets/background.png"),
  ]);

  const assets: Assets = {
    background: AssetsLoader.getAsset("background"),
  };
};

main();
