// 003_snake/src/entities/SnakePart.ts

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
    isHead: boolean,
  ) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
    this.isHead = isHead;
  }

  public setHead(head: boolean): void {
    this.isHead = head;
  }

  public getHead(): boolean {
    return this.isHead;
  }

  public setImage(img: HTMLImageElement): void {
    this.image = img;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public getCoordY(): number {
    return this.coordY;
  }

  // public update(direction: SnakeDirection, tile: number) {
  //   switch (direction) {
  //     case "left":
  //       this.coordX -= tile;
  //       break;
  //     case "up":
  //       this.coordY -= tile;
  //       break;
  //     case "right":
  //       this.coordX += tile;
  //       break;
  //     case "down":
  //       this.coordY += tile;
  //   }

  //   console.log(direction);
  // }

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
