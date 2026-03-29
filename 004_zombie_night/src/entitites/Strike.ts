export class Strike {
  private strikeImageLeft: HTMLImageElement;
  private strikeImageRight: HTMLImageElement;
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
    this.strikeImageLeft = leftImg;
    this.strikeImageRight = rightImg;
    this.currentImage = this.strikeImageLeft;
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
