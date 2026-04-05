export class Projectile {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 1200;
  private direction: string;
  private alive: boolean;

  constructor(img: HTMLImageElement, x: number, y: number, w: number, h: number, direction: string) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;

    this.direction = direction;
    this.alive = true;
  }

  public setDead(): void {
    this.alive = !this.alive;
  }

  public checkAlive(): boolean {
    return this.alive;
  }

  public move(delta: number, worldSpeed: number = 0): void {
    let actualSpeed = 0;

    if (this.direction === "left") {
      actualSpeed = this.speed - worldSpeed;
      this.coordX -= actualSpeed * delta;
    } else if (this.direction === "right") {
      actualSpeed = this.speed + worldSpeed;
      this.coordX += actualSpeed * delta;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.coordX, this.coordY, this.width, this.height);
  }
}
