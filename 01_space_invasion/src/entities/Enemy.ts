export class Enemy {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 1;
  private isAlive: boolean = true;

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

  update() {
    this.coordY += this.speed;
  }

  isOffScreen(canvasHeight: number) {
    return this.coordY > canvasHeight;
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
