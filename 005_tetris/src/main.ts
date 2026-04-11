import { AssetsLoader } from "./lib/AssetsLoader";
import type { GameConstants } from "./types/types";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<canvas id="canvas"></canvas>`;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("No 2D context");
}

const gameConstants: GameConstants = {
  brickSize: 30,
};

canvas.width = gameConstants.brickSize * 10;
canvas.height = gameConstants.brickSize * 17;

const main = async () => {};

main();
