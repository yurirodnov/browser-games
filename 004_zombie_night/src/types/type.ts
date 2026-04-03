export interface SurvivorAssets {
  survivorLeft: HTMLImageElement;
  survivorKnifeLeft: HTMLImageElement;
  survivorWalk1Left: HTMLImageElement;
  survivorWalk2Left: HTMLImageElement;
  survivorRight: HTMLImageElement;
  survivorKnifeRight: HTMLImageElement;
  survivorWalk1Right: HTMLImageElement;
  survivorWalk2Right: HTMLImageElement;
}

export interface ZombiesAssets {
  zombieGreenLeft1: HTMLImageElement;
  zombieGreenLeft2: HTMLImageElement;
  zombieGreenRight1: HTMLImageElement;
  zombieGreenRight2: HTMLImageElement;
}

export interface StrikeAssets {
  strikeLeft: HTMLImageElement;
  strikeRight: HTMLImageElement;
}

export interface ShootAssets {
  shootLeft: HTMLImageElement;
  shootRight: HTMLImageElement;
}

export interface Assets {
  survivor: SurvivorAssets;
  zombies: ZombiesAssets;
  strike: StrikeAssets;
  shoot: ShootAssets;
  ground: HTMLImageElement;
  background: HTMLImageElement;
  bullet: HTMLImageElement;
  life: HTMLImageElement;
  projectile: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  playerWidth: number;
  playerHeight: number;
  shootSize: number;
}

export type GameState = "menu" | "play" | "gameOver";

export type SurvivorMovementState = "left" | "right" | "stop";

export type SurvivorWeaponState = "shotgun" | "knife";
