export class Strike {
  private strikeLeftImage: HTMLImageElement;
  private strikeRightImage: HTMLImageElement;
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
    this.strikeLeftImage = leftImg;
    this.strikeRightImage = rightImg;
    this.currentImage = this.strikeLeftImage;
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
