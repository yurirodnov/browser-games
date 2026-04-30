import type { FigureType } from "../types/types";
import type { Brick } from "./Brick";

export class Figure {
  private brick: Brick;
  private figureType: FigureType;

  constructor(brick: Brick, figureType: FigureType) {
    this.brick = brick;
    this.figureType = figureType;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage();
  }
}
