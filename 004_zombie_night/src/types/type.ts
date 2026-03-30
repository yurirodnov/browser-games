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

export interface StrikeAssets {
  strikeLeft: HTMLImageElement;
  strikeRight: HTMLImageElement;
}

export interface Assets {
  survivor: SurvivorAssets;
  strike: StrikeAssets;
  ground: HTMLImageElement;
  background: HTMLImageElement;
  bullet: HTMLImageElement;
  life: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  playerWidth: number;
  playerHeight: number;
}

export type GameState = "menu" | "play" | "gameOver";

export type SurvivorMovementState = "left" | "right" | "stop";

export type SurvivorWeaponState = "shotgun" | "knife";
