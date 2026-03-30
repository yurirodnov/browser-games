import type {
  Assets,
  Constants,
  StrikeAssets,
  SurvivorAssets,
} from "./types/type";
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
  playerWidth: 100,
  playerHeight: 200,
};

canvas.width = constants.tileSize * 18;
canvas.height = constants.tileSize * 8;

export const main = async () => {
  await Promise.all([
    AssetsLoader.loadAsset("ground", "assets/ground.png"),
    AssetsLoader.loadAsset(
      "survivorLeft",
      "assets/hero_shotgun_sketch_left.png",
    ),
    AssetsLoader.loadAsset(
      "survivorKnifeLeft",
      "assets/hero_knife_sketch_left.png",
    ),
    AssetsLoader.loadAsset(
      "survivorWalk1Left",
      "assets/hero_shotgun_sketch_left_walk_1.png",
    ),
    AssetsLoader.loadAsset(
      "survivorWalk2Left",
      "assets/hero_shotgun_sketch_left_walk_2.png",
    ),
    AssetsLoader.loadAsset(
      "survivorRight",
      "assets/hero_shotgun_sketch_right.png",
    ),
    AssetsLoader.loadAsset(
      "survivorKnifeRight",
      "assets/hero_knife_sketch_right.png",
    ),
    AssetsLoader.loadAsset(
      "survivorWalk1Right",
      "assets/hero_shotgun_sketch_right_walk_1.png",
    ),
    AssetsLoader.loadAsset(
      "survivorWalk2Right",
      "assets/hero_shotgun_sketch_right_walk_2.png",
    ),
    AssetsLoader.loadAsset("background", "assets/background.png"),
    AssetsLoader.loadAsset("bullet", "assets/bullet.png"),
    AssetsLoader.loadAsset("life", "assets/life.png"),
    AssetsLoader.loadAsset("strikeLeft", "assets/strike_left.png"),
    AssetsLoader.loadAsset("strikeRight", "assets/strike_right.png"),
  ]);

  const survivorAssets: SurvivorAssets = {
    survivorLeft: AssetsLoader.getAsset("survivorLeft"),
    survivorKnifeLeft: AssetsLoader.getAsset("survivorKnifeLeft"),
    survivorWalk1Left: AssetsLoader.getAsset("survivorWalk1Left"),
    survivorWalk2Left: AssetsLoader.getAsset("survivorWalk2Left"),
    survivorRight: AssetsLoader.getAsset("survivorRight"),
    survivorKnifeRight: AssetsLoader.getAsset("survivorKnifeRight"),
    survivorWalk1Right: AssetsLoader.getAsset("survivorWalk1Right"),
    survivorWalk2Right: AssetsLoader.getAsset("survivorWalk2Right"),
  };

  const strikeAssets: StrikeAssets = {
    strikeLeft: AssetsLoader.getAsset("strikeLeft"),
    strikeRight: AssetsLoader.getAsset("strikeRight"),
  };

  const assets: Assets = {
    survivor: survivorAssets,
    strike: strikeAssets,
    ground: AssetsLoader.getAsset("ground"),
    background: AssetsLoader.getAsset("background"),
    bullet: AssetsLoader.getAsset("bullet"),
    life: AssetsLoader.getAsset("life"),
  };

  const game = new Game(ctx, assets, constants);
};

main();
