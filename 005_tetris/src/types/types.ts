export interface GameConstants {
  brickSize: number;
}

export interface PicsAssets {
  brick: HTMLImageElement;
}

export interface SoundsAssets {}

export interface GameAssets {
  picsAssets: PicsAssets;
}

export type GameScreenState = "menu" | "play" | "gameOver";

export type BrickColor = "red" | "green" | "blue" | "yellow" | "orange" | "purple";

export type FigureType = "S" | "Z" | "O" | "L" | "R" | "I";
