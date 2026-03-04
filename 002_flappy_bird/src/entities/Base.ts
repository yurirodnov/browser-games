// 002_flappy_bird/src/entities/Base.ts

export class Base {
  private image: HTMLImageElement;
  private coordX1: number;
  private coordY: number;
  private width1: number;
  private height: number;

  private coordX2: number;
  private width2: number;

  private canvasWindth: number;

  constructor(
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.image = img;
    this.coordX1 = x;
    this.coordX2 = x + w;
    this.coordY = y;
    this.width1 = w;
    this.width2 = w;
    this.height = h;
    this.canvasWindth = w;
  }

  public getCooordY(): number {
    return this.coordY;
  }

  public getCooordX1(): number {
    return this.coordX1;
  }

  public getCooordX2(): number {
    return this.coordX2;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth1(): number {
    return this.width1;
  }

  public getWidth2(): number {
    return this.width2;
  }

  public update(delta: number): void {
    this.coordX1 -= 20 * delta;
    this.coordX2 -= 20 * delta;

    if (this.coordX1 <= -this.canvasWindth) {
      this.coordX1 = this.coordX2 + this.width2;
    }

    if (this.coordX2 <= -this.canvasWindth) {
      this.coordX2 = this.coordX1 + this.width1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.coordX1,
      this.coordY,
      this.width1,
      this.height,
    );

    ctx.drawImage(
      this.image,
      this.coordX2,
      this.coordY,
      this.width2,
      this.height,
    );
  }
}
