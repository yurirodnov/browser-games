// 01_space_invasion/src/entities/Projectile.ts

export class Projectile {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 7;

  constructor(
    image: HTMLImageElement,
    spaceshipCoordX: number,
    spaceShipCoordY: number,
    spaceShipWidth: number,
    spaceShipHeight: number,
    w: number,
    h: number,
  ) {
    this.image = image;
    this.coordX = spaceshipCoordX + spaceShipWidth / 4.5;
    this.coordY = spaceShipCoordY - spaceShipHeight / 2;
    this.width = w;
    this.height = h;
  }

  isOffScreen() {
    return this.coordY + this.height < 0;
  }

  update(): void {
    this.coordY -= this.speed;
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
