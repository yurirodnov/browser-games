import type {
  Assets,
  Constants,
  StrikeAssets,
  ShootAssets,
  SurvivorAssets,
  ZombiesAssets,
  SoundsAssets,
} from "./types/type";
import { Game } from "./entitites/Game";
import { ImagesLoader } from "./lib/ImagesLoader";
import { AudioLoader } from "./lib/AudioLoader";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<canvas id="canvas"></canvas>`;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("No 2D context");
}

const constants: Constants = {
  tileSize: 60,
  playerWidth: 100,
  playerHeight: 200,
  zombieWidth: 100,
  zombieHeight: 200,
  shootSize: 40,
  bloodSize: 80,
  zombieDeathSize: 200,
  ammoSize: 50,
};

canvas.width = constants.tileSize * 18;
canvas.height = constants.tileSize * 8;

export const main = async () => {
  await Promise.all([
    ImagesLoader.loadAsset("ground", "assets/ground.png"),
    ImagesLoader.loadAsset("survivorLeft", "assets/hero_shotgun_sketch_left.png"),
    ImagesLoader.loadAsset("survivorKnifeLeft", "assets/hero_knife_sketch_left.png"),
    ImagesLoader.loadAsset("survivorWalk1Left", "assets/hero_shotgun_sketch_left_walk_1.png"),
    ImagesLoader.loadAsset("survivorWalk2Left", "assets/hero_shotgun_sketch_left_walk_2.png"),
    ImagesLoader.loadAsset("survivorRight", "assets/hero_shotgun_sketch_right.png"),
    ImagesLoader.loadAsset("survivorKnifeRight", "assets/hero_knife_sketch_right.png"),
    ImagesLoader.loadAsset("survivorWalk1Right", "assets/hero_shotgun_sketch_right_walk_1.png"),
    ImagesLoader.loadAsset("survivorWalk2Right", "assets/hero_shotgun_sketch_right_walk_2.png"),
    ImagesLoader.loadAsset("background", "assets/background2.png"),
    ImagesLoader.loadAsset("bullet", "assets/bullet.png"),
    ImagesLoader.loadAsset("life", "assets/life.png"),
    ImagesLoader.loadAsset("strikeLeft", "assets/strike_left.png"),
    ImagesLoader.loadAsset("strikeRight", "assets/strike_right.png"),
    ImagesLoader.loadAsset("shootLeft", "assets/shoot_left.png"),
    ImagesLoader.loadAsset("shootRight", "assets/shoot_right.png"),
    ImagesLoader.loadAsset("projectile", "assets/projectile.png"),
    ImagesLoader.loadAsset("zombieGreenLeft1", "assets/zombie_green_left_1.png"),
    ImagesLoader.loadAsset("zombieGreenLeft2", "assets/zombie_green_left_2.png"),
    ImagesLoader.loadAsset("zombieGreenRight1", "assets/zombie_green_right_1.png"),
    ImagesLoader.loadAsset("zombieGreenRight2", "assets/zombie_green_right_2.png"),
    ImagesLoader.loadAsset("zombieYellowLeft1", "assets/zombie_yellow_left_1.png"),
    ImagesLoader.loadAsset("zombieYellowLeft2", "assets/zombie_yellow_left_2.png"),
    ImagesLoader.loadAsset("zombieYellowRight1", "assets/zombie_yellow_right_1.png"),
    ImagesLoader.loadAsset("zombieYellowRight2", "assets/zombie_yellow_right_2.png"),
    ImagesLoader.loadAsset("zombieRedLeft1", "assets/zombie_red_left_1.png"),
    ImagesLoader.loadAsset("zombieRedLeft2", "assets/zombie_red_left_2.png"),
    ImagesLoader.loadAsset("zombieRedRight1", "assets/zombie_red_right_1.png"),
    ImagesLoader.loadAsset("zombieRedRight2", "assets/zombie_red_right_2.png"),
    ImagesLoader.loadAsset("blood", "assets/blood.png"),
    ImagesLoader.loadAsset("zombieDeath", "assets/zombie_death.png"),
    ImagesLoader.loadAsset("survivorDeath", "assets/survivor_dead.png"),
    ImagesLoader.loadAsset("ammo", "assets/ammo.png"),
    AudioLoader.loadAsset("shootSound", "sounds/shoot.wav"),
    AudioLoader.loadAsset("zombiePunchSound", "sounds/zombie_punch.wav"),
  ]);

  const survivorAssets: SurvivorAssets = {
    survivorLeft: ImagesLoader.getAsset("survivorLeft"),
    survivorKnifeLeft: ImagesLoader.getAsset("survivorKnifeLeft"),
    survivorWalk1Left: ImagesLoader.getAsset("survivorWalk1Left"),
    survivorWalk2Left: ImagesLoader.getAsset("survivorWalk2Left"),
    survivorRight: ImagesLoader.getAsset("survivorRight"),
    survivorKnifeRight: ImagesLoader.getAsset("survivorKnifeRight"),
    survivorWalk1Right: ImagesLoader.getAsset("survivorWalk1Right"),
    survivorWalk2Right: ImagesLoader.getAsset("survivorWalk2Right"),
    survivorDeath: ImagesLoader.getAsset("survivorDeath"),
  };

  const strikeAssets: StrikeAssets = {
    strikeLeft: ImagesLoader.getAsset("strikeLeft"),
    strikeRight: ImagesLoader.getAsset("strikeRight"),
  };

  const shootAssets: ShootAssets = {
    shootLeft: ImagesLoader.getAsset("shootLeft"),
    shootRight: ImagesLoader.getAsset("shootRight"),
  };

  const zombiesAssets: ZombiesAssets = {
    zombieGreenLeft1: ImagesLoader.getAsset("zombieGreenLeft1"),
    zombieGreenLeft2: ImagesLoader.getAsset("zombieGreenLeft2"),
    zombieGreenRight1: ImagesLoader.getAsset("zombieGreenRight1"),
    zombieGreenRight2: ImagesLoader.getAsset("zombieGreenRight2"),
    zombieYellowLeft1: ImagesLoader.getAsset("zombieYellowLeft1"),
    zombieYellowLeft2: ImagesLoader.getAsset("zombieYellowLeft2"),
    zombieYellowRight1: ImagesLoader.getAsset("zombieYellowRight1"),
    zombieYellowRight2: ImagesLoader.getAsset("zombieYellowRight2"),
    zombieRedLeft1: ImagesLoader.getAsset("zombieRedLeft1"),
    zombieRedLeft2: ImagesLoader.getAsset("zombieRedLeft2"),
    zombieRedRight1: ImagesLoader.getAsset("zombieRedRight1"),
    zombieRedRight2: ImagesLoader.getAsset("zombieRedRight2"),
  };

  const soundsAssets: SoundsAssets = {
    shootSound: AudioLoader.getAsset("shootSound"),
    zombiePunchSound: AudioLoader.getAsset("zombiePunchSound"),
  };

  const assets: Assets = {
    survivor: survivorAssets,
    zombies: zombiesAssets,
    strike: strikeAssets,
    shoot: shootAssets,
    ground: ImagesLoader.getAsset("ground"),
    background: ImagesLoader.getAsset("background"),
    bullet: ImagesLoader.getAsset("bullet"),
    life: ImagesLoader.getAsset("life"),
    projectile: ImagesLoader.getAsset("projectile"),
    blood: ImagesLoader.getAsset("blood"),
    zombieDeath: ImagesLoader.getAsset("zombieDeath"),
    ammo: ImagesLoader.getAsset("ammo"),
    sounds: soundsAssets,
  };

  new Game(ctx, assets, constants);
};

main();
