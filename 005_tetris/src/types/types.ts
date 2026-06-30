// 005_tetris/src/types/types.ts

export interface GameConstants {
  brickSize: number;
  backgroundTileSize: number;
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
  backgroundTile: HTMLImageElement;
  HUD: HTMLImageElement;
}

export interface SoundsAssets {}

export interface GameAssets {
  picsAssets: PicsAssets;
}

export type GameGridCellColor = "";

export type GameGridMatrix = string[][];

export type FigureMatrix = number[][][];

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

export type ColorNumber = "1" | "2" | "3" | "4" | "5" | "6";

export type FigureType = "S" | "Z" | "O" | "L" | "J" | "I" | "T";

export interface ColorNumberMapType {
  red: ColorNumber;
  green: ColorNumber;
  blue: ColorNumber;
  yellow: ColorNumber;
  orange: ColorNumber;
  purple: ColorNumber;
}

export interface NumberColorMapType {
  1: BrickColor;
  2: BrickColor;
  3: BrickColor;
  4: BrickColor;
  5: BrickColor;
  6: BrickColor;
}
