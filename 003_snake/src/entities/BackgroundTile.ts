// 003_snake/src/entities/BackgroundTile.ts

export class BackgroundTile {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(img: HTMLImageElement, x: number, y: number, s: number) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = s;
    this.height = s;
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
