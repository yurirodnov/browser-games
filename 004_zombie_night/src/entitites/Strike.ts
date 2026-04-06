import type { StrikeAssets } from "../types/type";

export class Strike {
  private strikeImages: StrikeAssets;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(strikeImages: StrikeAssets, x: number, y: number, w: number, h: number, direction: string) {
    this.strikeImages = strikeImages;
    this.currentImage = direction === "left" ? this.strikeImages.strikeLeft : this.strikeImages.strikeRight;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.currentImage, this.coordX, this.coordY, this.width, this.height);
  }
}
