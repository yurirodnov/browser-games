// 005_tetris/src/entities/Figure.ts

import type { BrickColor, BricksAssets, FigureMatrix, FigureType, GameConstants } from "../types/types";
import { MatrixFigureMap } from "../lib/MatrixFigureMap";

export class Figure {
  private bricksAssets: BricksAssets;
  private brickColor: BrickColor;
  private figureType: FigureType;
  private matrix: FigureMatrix;
  private constatnts: GameConstants;
  private positionX: number;
  private positionY: number;

  constructor(
    figureType: FigureType,
    brickColor: BrickColor,
    bricksAssets: BricksAssets,
    constants: GameConstants,
    startX: number,
    startY: number,
  ) {
    this.figureType = figureType;
    this.brickColor = brickColor;
    this.bricksAssets = bricksAssets;
    this.constatnts = constants;
    this.positionX = startX;
    this.positionY = startY;

    this.matrix = MatrixFigureMap[this.figureType as keyof typeof MatrixFigureMap];
  }

  public rotate(): void {}

  public drop(offsetY: number): void {
    console.log("changed position");
    this.positionY += offsetY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.matrix.length; i += 1) {
      for (let j = 0; j < this.matrix[i].length; j += 1) {
        if (this.matrix[i][j] === 1) {
          ctx.drawImage(
            this.bricksAssets[this.brickColor],
            j * this.constatnts.brickSize + this.positionX,
            i * this.constatnts.brickSize + this.positionY,
            this.constatnts.brickSize,
            this.constatnts.brickSize,
          );
        }
      }
    }
  }
}
