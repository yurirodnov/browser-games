// 004_zombie_night/src/entities/Zombie.ts

import type { ZombiesAssets } from "../types/type";

export class Zombie {
  private zombieImages: ZombiesAssets;
  private currentImage: HTMLImageElement;

  private coordX: number = 0;
  private coordY: number = 0;
  private width: number;
  private height: number;

  private lives: number = 3;
  private speed: number = 50;
  private walkTimer: number = 0;
  private side: string;

  private readonly WALK_ANIMATION_SPEED = 3;
  private readonly WALK_ANIMATION_FRAME = 4;
  private readonly WALK_ANIMATION_TOTAL_FRAMES = 2;

  constructor(zombieImages: ZombiesAssets, side: string, y: number, w: number, h: number, zombieType: string) {
    console.log("Spawn side", side);
    this.zombieImages = zombieImages;
    this.side = side;
    if (this.side === "left") {
      this.currentImage = this.zombieImages.zombieGreenLeft1;
      this.coordX = -540;
      this.coordY = y;
    } else if (this.side === "right") {
      this.currentImage = this.zombieImages.zombieGreenRight1;
      this.coordX = 2000;
      this.coordY = y;
    }

    this.width = w;
    this.height = h;
  }

  public move(delta: number): void {
    if (this.side === "left") {
      this.coordX += this.speed * delta;
    } else if (this.side === "right") {
      this.coordX -= this.speed * delta;
    }

    this.changeAnimation(delta);
  }

  private changeAnimation(delta: number): void {
    this.walkTimer += this.WALK_ANIMATION_SPEED * delta;
    console.log("walktimer", this.walkTimer);
    const frameIndex = Math.floor(this.walkTimer / this.WALK_ANIMATION_FRAME) % this.WALK_ANIMATION_TOTAL_FRAMES;
    if (frameIndex === 0) {
      this.currentImage =
        this.side === "left" ? this.zombieImages.zombieGreenLeft1 : this.zombieImages.zombieGreenRight1;
    } else {
      this.currentImage =
        this.side === "left" ? this.zombieImages.zombieGreenLeft2 : this.zombieImages.zombieGreenRight2;
    }
  }

  draw(ctx: CanvasRenderingContext2D, worldOffset: number): void {
    ctx.drawImage(this.currentImage, this.coordX + worldOffset, this.coordY, this.width, this.height);
  }
}
