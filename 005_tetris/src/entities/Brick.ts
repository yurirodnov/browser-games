import type { BrickColor, BricksAssets } from "../types/types";

export class Brick {
  private images: BricksAssets;
  private currentImage: HTMLImageElement;
  private color: BrickColor;

  private coordX: number;
  private coordY: number;

  private width: number;
  private height: number;

  constructor(images: BricksAssets, color: BrickColor, x: number, y: number, size: number) {
    this.images = images;
    this.color = color;

    this.coordX = x;
    this.coordY = y;

    this.width = size;
    this.height = size;
  }
}
