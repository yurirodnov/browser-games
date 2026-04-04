// 004_zombie_night/src/entities/Zombie.ts

import type { ZombiesAssets } from "../types/type";

export class Zombie {
  private zombieImages: ZombiesAssets;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private lives: number = 3;
  private speed: number = 90;

  private survivorDirection: string;

  constructor(
    zombieImages: ZombiesAssets,
    side: string,
    y: number,
    w: number,
    h: number,
    zombieType: string,
    direction: string,
  ) {
    this.zombieImages = zombieImages;
    if (side === "left") {
      this.currentImage = this.zombieImages.zombieGreenLeft1;
    } else if (side === "right") {
      this.currentImage = this.zombieImages.zombieGreenRight1;
    }

    if (side === "left") {
      this.coordX = -500;
      this.coordY = y;
    }
    this.coordX = 300;
    this.coordY = y;
    this.width = w;
    this.height = h;

    this.survivorDirection = direction;
  }

  public move(delta: number) {
    this.coordX += this.speed * delta;

    // if (this.survivorDirection === "left") {
    //   actualSpeed = this.speed + worldSpeed;
    //   this.coordX -= actualSpeed * delta;
    // } else if (this.survivorDirection === "right") {
    //   actualSpeed = this.speed;
    //   this.coordX += actualSpeed * delta;
    // } else if (this.survivorDirection === "stop") {
    //   actualSpeed = this.speed;
    //   this.coordX += actualSpeed * delta;
    // }
  }

  draw(ctx: CanvasRenderingContext2D, worldOffset: number) {
    ctx.drawImage(this.currentImage, this.coordX + worldOffset, this.coordY, this.width, this.height);
  }
}
