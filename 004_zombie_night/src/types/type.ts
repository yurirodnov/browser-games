export interface Assets {
  ground: HTMLImageElement;
  survivor: HTMLImageElement;
  background: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
}

export type GameState = "menu" | "play" | "gameOver";
