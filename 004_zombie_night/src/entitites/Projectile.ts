export class Projectile {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 1200;
  private direction: string;
  private exists: boolean;

  constructor(img: HTMLImageElement, x: number, y: number, w: number, h: number, direction: string) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;

    this.direction = direction;
    this.exists = true;
  }

  public move(delta: number, worldSpeed: number = 0) {
    let actualSpeed = 0;

    if (this.direction === "left") {
      actualSpeed = this.speed - worldSpeed;
      this.coordX -= actualSpeed * delta;
    } else if (this.direction === "right") {
      actualSpeed = this.speed + worldSpeed;
      this.coordX += actualSpeed * delta;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.coordX, this.coordY, this.width, this.height);
  }
}
