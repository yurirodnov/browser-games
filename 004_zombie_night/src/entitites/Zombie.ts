// 004_zombie_night/src/entities/Zombie.ts

import type { ZombiesAssets, ZombyBodySize } from "../types/type";
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

  private ammoDropChance: number = 20;

  private walkAnimationSpeed = 10;
  private readonly WALK_ANIMATION_FRAME = 6;
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

    // SET DIFFRENT AMOUNT LIFE FOR A ZOMBIE
    switch (zombieType) {
      case "yellow":
        this.life = 1;
        this.speed += this.speed * 2;
        this.walkAnimationSpeed = 30;
        break;
      case "green":
        this.life = 3;
        break;
      case "red":
        this.life = 5;
    }

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

  public getDropChance(): number {
    return this.ammoDropChance;
  }

  public getDamage(damageAmount: number): void {
    this.life -= damageAmount;
  }

  public move(delta: number): void {
    if (this.side === "left") {
      this.coordX += this.speed * delta;
    } else if (this.side === "right") {
      this.coordX -= this.speed * delta;
    }
    this.changeAnimation(delta);
  }

  public getBodySize(): ZombyBodySize {
    const zombieBodySize: ZombyBodySize = {
      leftEdge: this.coordX,
      rightEdge: this.coordX + this.width,
    };

    return zombieBodySize;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public getCoordY(): number {
    return this.coordY;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getLifePoints(): number {
    return this.life;
  }

  public isAlive(): boolean {
    return this.life > 0;
  }

  private getAccessKey(frame: 1 | 2): keyof ZombiesAssets {
    const color = ZombieTypeConfig[this.zombieType as keyof typeof ZombieTypeConfig] ?? "Green";
    const side = this.side === "left" ? "Left" : "Right";

    return `zombie${color}${side}${frame}` as keyof ZombiesAssets;
  }

  private changeAnimation(delta: number): void {
    this.walkTimer += this.walkAnimationSpeed * delta;
    const frameIndex = Math.floor(this.walkTimer / this.WALK_ANIMATION_FRAME) % this.WALK_ANIMATION_TOTAL_FRAMES;
    const key = frameIndex === 0 ? this.getAccessKey(1) : this.getAccessKey(2);
    this.currentImage = this.zombieImages[key] ?? this.zombieImages.zombieGreenLeft1;
  }

  public draw(ctx: CanvasRenderingContext2D, worldOffset: number): void {
    ctx.drawImage(this.currentImage, this.coordX + worldOffset, this.coordY, this.width, this.height);
  }
}
