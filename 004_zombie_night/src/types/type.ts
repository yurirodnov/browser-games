export interface Assets {
  ground: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
}

export type GameState = "menu" | "play" | "gameOver";
