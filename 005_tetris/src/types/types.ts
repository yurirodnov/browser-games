export interface GameConstants {
  brickSize: number;
}

export interface GameAssets {
  brick: HTMLImageElement;
}

export type GameScreenState = "menu" | "play" | "gameOver";
