export class Blood {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private lifeTimer: number = 20;

  constructor(img: HTMLImageElement, x: number, y: number, s: number) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = s;
    this.height = s;
  }

  public startLifeTimer(): void {
    this.lifeTimer -= 1;
  }

  public getLifeTimer(): number {
    return this.lifeTimer;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.coordX, this.coordY, this.width, this.height);
  }
}
