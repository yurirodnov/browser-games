// 01_space_invasion/src/entities/Spaceship.ts

export class Spaceship {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 300;

  constructor(
    image: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.image = image;
    this.coordX = x / 2 - w / 2;
    this.coordY = y - h - 15;
    this.width = w;
    this.height = h;
  }

  getCoordX() {
    return this.coordX;
  }

  getCoordY() {
    return this.coordY;
  }

  getSizeX() {
    return this.width;
  }

  getSizeY() {
    return this.height;
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

  update(
    leftArrow: boolean,
    rightArrow: boolean,
    canvasWidth: number,
    delta: number,
  ) {
    if (leftArrow) {
      this.coordX -= this.speed * delta;
    }
    if (rightArrow) {
      this.coordX += this.speed * delta;
    }

    if (this.coordX < 0) {
      this.coordX = 0;
    }
    if (this.coordX + this.width > canvasWidth) {
      this.coordX = canvasWidth - this.width;
    }
  }
}
