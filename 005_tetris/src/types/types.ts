// 005_tetris/src/types/types.ts

export interface GameConstants {
  brickSize: number;
  gameGridWidth: number;
  gameGridHeight: number;
  hudGridWidth: number;
  hudGridHeight: number;
}

export interface BricksAssets {
  red: HTMLImageElement;
  green: HTMLImageElement;
  blue: HTMLImageElement;
  yellow: HTMLImageElement;
  purple: HTMLImageElement;
  orange: HTMLImageElement;
}

export interface PicsAssets {
  bricks: BricksAssets;
  background: HTMLImageElement;
  HUD: HTMLImageElement;
}

export interface SoundsAssets {}

export interface GameAssets {
  picsAssets: PicsAssets;
}

export interface MatrixFigureMapType {
  S: FigureMatrix;
  Z: FigureMatrix;
  O: FigureMatrix;
  L: FigureMatrix;
  J: FigureMatrix;
  I: FigureMatrix;
  T: FigureMatrix;
}

export type GameScreenState = "menu" | "play" | "gameOver";

export type BrickColor = "red" | "green" | "blue" | "yellow" | "orange" | "purple";

export type FigureType = "S" | "Z" | "O" | "L" | "J" | "I" | "T" | ".";

export type FigureMatrix = number[][];
