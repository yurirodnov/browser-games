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

  public update(delta: number, direction: SnakeDirection, tile: number) {
    switch (direction) {
      case "left":
        this.coordX -= tile;
        break;
      case "top":
        this.coordY -= tile;
        break;
      case "right":
        this.coordX += tile;
        break;
      case "down":
        this.coordY += tile;
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
