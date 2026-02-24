// 01_space_invasion/src/entities/Explosion.ts

export class Explosion {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private timer: number = 20;

  constructor(
    image: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.image = image;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  startTimer(): void {
    this.timer -= 1;
  }

  getTimer(): number {
    return this.timer;
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
