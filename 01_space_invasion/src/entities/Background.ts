export class Background {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    image: HTMLImageElement,
  ) {
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.coordX,
      this.coordY,
      this.width,
      this.height,
    );
  }
}
