export interface Assets {
  ground: HTMLImageElement;
  survivor: HTMLImageElement;
  background: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  playerWidth: number;
  playerHeight: number;
}

export type GameState = "menu" | "play" | "gameOver";

export type MovementState = "left" | "right" | "stop";
