import type { BrickColor, BricksAssets } from "../types/types";

export class Brick {
  private images: BricksAssets;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;

  private width: number;
  private height: number;

  constructor(images: BricksAssets, color: BrickColor, x: number, y: number, size: number) {
    this.images = images;
    this.currentImage = this.images[color];

    this.coordX = x;
    this.coordY = y;

    this.width = size;
    this.height = size;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.currentImage, this.coordX, this.coordY, this.width, this.height);
  }
}
