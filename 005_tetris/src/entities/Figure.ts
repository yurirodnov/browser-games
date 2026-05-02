// 005_tetris/src/entities/Figure.ts

import type { BrickColor, BricksAssets, FigureType } from "../types/types";

import type { Brick } from "./Brick";

export class Figure {
  private brickColor: BrickColor;
  private figureType: FigureType;

  constructor(figureType: FigureType, brickColor: BrickColor) {
    this.figureType = figureType;
    this.brickColor = brickColor;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage();
  }
}
