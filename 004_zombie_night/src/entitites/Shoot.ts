export class Shoot {
  private shootImageLeft: HTMLImageElement;
  private shootImageRight: HTMLImageElement;
  private currentImage: HTMLImageElement;

  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(
    leftImg: HTMLImageElement,
    rightImg: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.shootImageLeft = leftImg;
    this.shootImageRight = rightImg;
    this.currentImage = this.shootImageLeft;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.currentImage,
      this.coordX,
      this.coordY,
      this.width,
      this.height,
    );
  }
}
