export class Bird {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private jumpHeight: number = 10;
  private gravityPower: number = 20;

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

  public setImage(img: HTMLImageElement): void {
    this.image = img;
  }

  update(space: boolean, delta: number) {}

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
