// 005_tetris/src/entities/Figure.ts

import type { BrickColor, BricksAssets, FigureMatrix, FigureType } from "../types/types";
import { MatrixFigureMap } from "../lib/MatrixFigureMap";

export class Figure {
  private bricksAssets: BricksAssets;
  private brickColor: BrickColor;
  private figureType: FigureType;
  private matrix: FigureMatrix;

  constructor(figureType: FigureType, brickColor: BrickColor, bricksAssets: BricksAssets) {
    this.figureType = figureType;
    this.brickColor = brickColor;
    this.bricksAssets = bricksAssets;

    this.matrix = MatrixFigureMap[this.figureType as keyof typeof MatrixFigureMap];
  }

  public rotate(): void {}

  public move(): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage();
  }
}
