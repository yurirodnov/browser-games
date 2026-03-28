import type { MovementState } from "../types/type";

export class Survivor {
  private imageLeft: HTMLImageElement;
  private imageRight: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private lastDirection: MovementState = "left";

  constructor(
    imgLeft: HTMLImageElement,
    imgRight: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.imageLeft = imgLeft;
    this.imageRight = imgRight;
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
    offset: number,
    speed: number,
    delta: number,
    direction: MovementState,
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
  }

  public draw(ctx: CanvasRenderingContext2D, direction: MovementState) {
    if (direction === "left") {
      ctx.drawImage(
        this.imageLeft,
        this.coordX,
        this.coordY,
        this.width,
        this.height,
      );
      this.lastDirection = "left";
    } else if (direction === "right") {
      ctx.drawImage(
        this.imageRight,
        this.coordX,
        this.coordY,
        this.width,
        this.height,
      );
      this.lastDirection = "right";
    } else if (direction === "stop") {
      ctx.drawImage(
        this.lastDirection === "left" ? this.imageLeft : this.imageRight,
        this.coordX,
        this.coordY,
        this.width,
        this.height,
      );
    }
  }
}
