// 002_flappy_bird/src/entities/Obstacle.ts

import type { Constants } from "../types/types";

export class Obstacle {
  private imageUP: HTMLImageElement;
  private widthUP: number;
  private heightUP: number;
  private coordYUP: number;

  private imageDOWN: HTMLImageElement;
  private widthDOWN: number;
  private heightDOWN: number;
  private coordYDOWN: number;

  //   private canvasMid: number;
  private coordX: number;
  private speed: number;
  private passed: boolean = false;

  constructor(
    imgUP: HTMLImageElement,
    imgDOWN: HTMLImageElement,
    x: number,
    yUP: number,
    yDOWN: number,
    w: number,
    hUP: number,
    hDOWN: number,
    c: Constants,
    // canvasMid: number,
  ) {
    this.imageUP = imgUP;
    this.widthUP = w;
    this.heightUP = hUP;

    this.imageDOWN = imgDOWN;
    this.widthDOWN = w;
    this.heightDOWN = hDOWN;

    this.coordYUP = yUP;
    this.coordYDOWN = yDOWN;

    this.coordX = x;
    this.speed = c.screenSpeed;

    // this.canvasMid = canvasMid;
  }

  public getWidth(): number {
    return this.widthUP;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public getHeightUP(): number {
    return this.heightUP;
  }

  public getHeightDOWN(): number {
    return this.heightDOWN;
  }

  public getCoordYUP(): number {
    return this.coordYUP;
  }

  public getCoordYDOWN(): number {
    return this.coordYDOWN;
  }

  public getPassed(): boolean {
    return this.passed;
  }

  public setPassed(): void {
    this.passed = true;
  }

  public update(delta: number) {
    this.coordX -= this.speed * delta;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.imageUP,
      this.coordX,
      this.coordYUP,
      this.widthUP,
      this.heightUP,
    );

    ctx.drawImage(
      this.imageDOWN,
      this.coordX,
      this.coordYDOWN,
      this.widthDOWN,
      this.heightDOWN,
    );
  }
}
