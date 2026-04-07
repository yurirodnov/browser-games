export class Blood {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private lifeTimer: number = 1.2;

  constructor(img: HTMLImageElement, x: number, y: number, s: number) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = s;
    this.height = s;
  }

  public startLifeTimer(delta: number): void {
    if (this.lifeTimer !== 0) {
      this.lifeTimer -= delta;
    }
  }

  public getLifeTimer(): number {
    return this.lifeTimer;
  }

  public draw(ctx: CanvasRenderingContext2D, worldOffset: number): void {
    ctx.drawImage(this.image, this.coordX + worldOffset, this.coordY, this.width, this.height);
  }
}
