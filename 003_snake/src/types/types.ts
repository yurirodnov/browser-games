// 003_snake/src/types/types.ts

export interface Assets {
  background: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  canvasRows: number;
  canvasColumns: number;
}

export enum GameState {
  MENU = "menu",
  PLAY = "play",
  GAME_OVER = "gameOver",
}
