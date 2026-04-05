// 004_zombie_night/src/entities/Zombie.ts

import type { ZombiesAssets } from "../types/type";
import { ZombieTypeConfig } from "../lib/ZombieTypeConfig";

export class Zombie {
  private zombieImages: ZombiesAssets;
  private currentImage: HTMLImageElement;

  private coordX: number = 0;
  private coordY: number = 0;
  private width: number;
  private height: number;

  private life: number = 0;
  private speed: number = 40;
  private walkTimer: number = 0;
  private side: string;

  private zombieType: string;

  private readonly WALK_ANIMATION_SPEED = 3;
  private readonly WALK_ANIMATION_FRAME = 4;
  private readonly WALK_ANIMATION_TOTAL_FRAMES = 2;

  constructor(
    zombieImages: ZombiesAssets,
    spawnCoords: number,
    side: string,
    y: number,
    w: number,
    h: number,
    zombieType: string,
  ) {
    this.zombieImages = zombieImages;
    this.side = side;
    this.zombieType = zombieType;

    this.currentImage = this.zombieImages[this.getAccessKey(1)] ?? this.zombieImages.zombieGreenLeft1;
    if (this.side === "left") {
      this.coordX = spawnCoords;
      this.coordY = y;
    } else if (this.side === "right") {
      this.coordX = spawnCoords;
      this.coordY = y;
    }

    this.width = w;
    this.height = h;
  }

  public decreaseLife(): void {
    this.life -= 1;
  }

  public move(delta: number): void {
    if (this.side === "left") {
      this.coordX += this.speed * delta;
    } else if (this.side === "right") {
      this.coordX -= this.speed * delta;
    }

    this.changeAnimation(delta);
  }

  private getAccessKey(frame: 1 | 2): keyof ZombiesAssets {
    const color = ZombieTypeConfig[this.zombieType as keyof typeof ZombieTypeConfig] ?? "Green";
    const side = this.side === "left" ? "Left" : "Right";

    return `zombie${color}${side}${frame}` as keyof ZombiesAssets;
  }

  private changeAnimation(delta: number): void {
    this.walkTimer += this.WALK_ANIMATION_SPEED * delta;
    const frameIndex = Math.floor(this.walkTimer / this.WALK_ANIMATION_FRAME) % this.WALK_ANIMATION_TOTAL_FRAMES;
    const key = frameIndex === 0 ? this.getAccessKey(1) : this.getAccessKey(2);
    this.currentImage = this.zombieImages[key] ?? this.zombieImages.zombieGreenLeft1;
  }

  public draw(ctx: CanvasRenderingContext2D, worldOffset: number): void {
    ctx.drawImage(this.currentImage, this.coordX + worldOffset, this.coordY, this.width, this.height);
  }
}
