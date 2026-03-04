// 002_flappy_bird/src/entities/Obstacle.ts

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

  constructor(
    imgUP: HTMLImageElement,
    imgDOWN: HTMLImageElement,
    x: number,
    yUP: number,
    yDOWN: number,
    w: number,
    hUP: number,
    hDOWN: number,
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

    // this.canvasMid = canvasMid;
  }

  public getWidth(): number {
    return this.widthUP;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public update(delta: number) {
    this.coordX -= 17 * delta;
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
