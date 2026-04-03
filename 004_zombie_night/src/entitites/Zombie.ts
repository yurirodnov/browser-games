import type { ZombiesAssets } from "../types/type";

export class Zombie {
  private zombieImages: ZombiesAssets;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private lives: number = 3;
  private speed: number = 30;

  constructor(zombieImages: ZombiesAssets, s: string, y: number, w: number, h: number, t: string) {
    this.zombieImages = zombieImages;
    if (s === "left") {
      this.currentImage = this.zombieImages.zombieGreenLeft1;
    } else if (s === "right") {
      this.currentImage = this.zombieImages.zombieGreenRight1;
    }

    if (s === "left") {
      this.coordX = -500;
      this.coordY = y;
    }
    this.coordX = 300;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  public move(delta: number, worldSpeed: number = 0) {
    this.coordX += this.speed * delta;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.currentImage, this.coordX, this.coordY, this.width, this.height);
  }
}
