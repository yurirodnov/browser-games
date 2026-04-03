import type { ShootAssets } from "../types/type";

export class Shoot {
  private shootImages: ShootAssets;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(shootImages: ShootAssets, x: number, y: number, w: number, h: number, direction: string) {
    this.shootImages = shootImages;

    this.currentImage = direction === "left" ? this.shootImages.shootLeft : this.shootImages.shootRight;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.currentImage, this.coordX, this.coordY, this.width, this.height);
  }
}
