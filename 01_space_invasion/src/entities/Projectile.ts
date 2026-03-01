// 01_space_invasion/src/entities/Projectile.ts

export class Projectile {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 400;
  private alive: boolean;

  constructor(
    image: HTMLImageElement,
    coordX: number,
    coordY: number,

    w: number,
    h: number,
  ) {
    this.image = image;
    this.coordX = coordX;
    this.coordY = coordY;
    this.width = w;
    this.height = h;

    this.alive = true;
  }

  getHeight(): number {
    return this.height;
  }

  getWidth(): number {
    return this.width;
  }

  getCoordX(): number {
    return this.coordX;
  }

  getCoordY(): number {
    return this.coordY;
  }

  getAlive(): boolean {
    return this.alive;
  }

  setDead(): void {
    this.alive = false;
  }

  isOffScreen() {
    return this.coordY + this.height < 0;
  }

  update(delta: number): void {
    this.coordY -= this.speed * delta;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.coordX,
      this.coordY,
      this.width,
      this.height,
    );
  }
}
