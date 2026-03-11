// 003_snake/src/entities/BackgroundTile.ts

export class BackgroundTile {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(
    imgDark: HTMLImageElement,
    imgLight: HTMLImageElement,
    x: number,
    y: number,
    s: number,
    row: number,
    col: number,
  ) {
    this.coordX = x;
    this.coordY = y;
    this.width = s;
    this.height = s;

    const isDark = (row + col) % 2 === 0 ? true : false;
    this.image = isDark ? imgDark : imgLight;
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
