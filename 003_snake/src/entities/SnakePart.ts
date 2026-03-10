import type { SnakeDirection } from "../types/types";

export class SnakePart {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private isHead: boolean = false;

  constructor(
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  public setHead(): void {
    this.isHead = true;
  }

  public getHead(): boolean {
    return this.isHead;
  }

  public update(delta: number, direction: SnakeDirection) {
    switch (direction) {
      case "left":
        this.coordX -= 30;
        break;
      case "top":
        this.coordY -= 30;
        break;
      case "right":
        this.coordX += 10;
        break;
      case "down":
        this.coordY += 30;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.coordX,
      this.coordY,
      this.width,
      this.height,
    );
  }
}
