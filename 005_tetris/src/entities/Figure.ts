// 005_tetris/src/entities/Figure.ts

import type { BrickColor, BricksAssets, FigureMatrix, FigureType, GameConstants } from "../types/types";
import { MatrixFigureMap } from "../lib/MatrixFigureMap";

export class Figure {
  private bricksAssets: BricksAssets;
  private brickColor: BrickColor;
  private figureType: FigureType;
  private matrix: FigureMatrix;
  private constatnts: GameConstants;

  constructor(figureType: FigureType, brickColor: BrickColor, bricksAssets: BricksAssets, constants: GameConstants) {
    this.figureType = figureType;
    this.brickColor = brickColor;
    this.bricksAssets = bricksAssets;
    this.constatnts = constants;

    this.matrix = MatrixFigureMap[this.figureType as keyof typeof MatrixFigureMap];
  }

  public rotate(): void {}

  public move(): void {}

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.matrix.length; i += 1) {
      for (let j = 0; j < this.matrix[i].length; j += 1) {
        if (this.matrix[i][j] === 1) {
          ctx.drawImage(
            this.bricksAssets[this.brickColor],
            j * this.constatnts.brickSize,
            i * this.constatnts.brickSize,
            this.constatnts.brickSize,
            this.constatnts.brickSize,
          );
        }
      }
    }
  }
}
