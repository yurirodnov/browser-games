// 003_snake/src/types/types.ts

export interface Assets {
  tileDark: HTMLImageElement;
  tileLight: HTMLImageElement;
  snakeBody: HTMLImageElement;
  snakeHeadUp: HTMLImageElement;
  snakeHeadRight: HTMLImageElement;
  snakeHeadDown: HTMLImageElement;
  snakeHeadLeft: HTMLImageElement;
}

export interface Constants {
  tileSize: number;
  canvasRows: number;
  canvasColumns: number;
}

export type SnakeDirection = "left" | "up" | "right" | "down";

export enum GameState {
  MENU = "menu",
  PLAY = "play",
  GAME_OVER = "gameOver",
}
