// 003_snake/src/entities/Apple.ts

export class Apple {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private isEaten: boolean = false;

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

  public getCoordX(): number {
    return this.coordX;
  }

  public getCoordY(): number {
    return this.coordY;
  }

  public getEaten(): boolean {
    return this.isEaten;
  }

  public setEaten(): void {
    this.isEaten = true;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.coordX,
      this.coordY,
      this.width,
      this.height,
    );
  }
}
