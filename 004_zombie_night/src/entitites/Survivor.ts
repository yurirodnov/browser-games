import type { SurvivorMovementState, SurvivorAssets } from "../types/type";

export class Survivor {
  private survivorImages: SurvivorAssets;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private lastDirection: SurvivorMovementState = "left";

  private walkTimer: number = 0;
  private walkAnimationInterval: number = 0;

  constructor(
    survivorImages: SurvivorAssets,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.survivorImages = survivorImages;
    this.coordX = x;
    this.coordY = y;

    this.width = w;
    this.height = h;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public getCoordY(): number {
    return this.coordY;
  }

  public update(
    // offset: number,
    speed: number,
    delta: number,
    direction: SurvivorMovementState,
    canvasWidth: number,
  ): void {
    if (direction === "left" && this.coordX > 0) {
      this.coordX -= speed * delta;
    } else if (
      direction === "right" &&
      this.coordX < canvasWidth - this.width
    ) {
      this.coordX += speed * delta;
    }

    // SURVIVOR WALK ANIMATION
    if (direction === "left") {
      this.walkTimer += 10 * delta;
    } else if (direction === "right") {
      this.walkTimer += 10 * delta;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, direction: SurvivorMovementState) {
    if (direction === "left") {
      ctx.drawImage(
        this.survivorImages.survivorLeft,
        this.coordX,
        this.coordY,
        this.width,
        this.height,
      );
      this.lastDirection = "left";
    } else if (direction === "right") {
      ctx.drawImage(
        this.survivorImages.survivorRight,
        this.coordX,
        this.coordY,
        this.width,
        this.height,
      );
      this.lastDirection = "right";
    } else if (direction === "stop") {
      ctx.drawImage(
        this.lastDirection === "left"
          ? this.survivorImages.survivorLeft
          : this.survivorImages.survivorRight,
        this.coordX,
        this.coordY,
        this.width,
        this.height,
      );
    }
  }
}
