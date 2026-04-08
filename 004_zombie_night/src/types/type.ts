export interface SurvivorAssets {
  survivorLeft: HTMLImageElement;
  survivorKnifeLeft: HTMLImageElement;
  survivorWalk1Left: HTMLImageElement;
  survivorWalk2Left: HTMLImageElement;
  survivorRight: HTMLImageElement;
  survivorKnifeRight: HTMLImageElement;
  survivorWalk1Right: HTMLImageElement;
  survivorWalk2Right: HTMLImageElement;
  survivorDeath: HTMLImageElement;
}

export interface ZombiesAssets {
  zombieGreenLeft1: HTMLImageElement;
  zombieGreenLeft2: HTMLImageElement;
  zombieGreenRight1: HTMLImageElement;
  zombieGreenRight2: HTMLImageElement;
  zombieYellowLeft1: HTMLImageElement;
  zombieYellowLeft2: HTMLImageElement;
  zombieYellowRight1: HTMLImageElement;
  zombieYellowRight2: HTMLImageElement;
  zombieRedLeft1: HTMLImageElement;
  zombieRedLeft2: HTMLImageElement;
  zombieRedRight1: HTMLImageElement;
  zombieRedRight2: HTMLImageElement;
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
  blood: HTMLImageElement;
  zombieDeath: HTMLImageElement;
  ammo: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  playerWidth: number;
  playerHeight: number;
  zombieWidth: number;
  zombieHeight: number;
  shootSize: number;
  bloodSize: number;
  zombieDeathSize: number;
  ammoSize: number;
}

export interface ZombyBodySize {
  leftEdge: number;
  rightEdge: number;
}

export type GameState = "menu" | "play" | "dying" | "gameOver";

export type SurvivorMovementState = "left" | "right" | "stop";

export type SurvivorWeaponState = "shotgun" | "knife";
