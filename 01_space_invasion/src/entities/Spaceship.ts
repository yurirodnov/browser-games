// 01_space_invasion/src/entities/Spaceship.ts

export class Spaceship {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;
  private speed: number = 3;

  constructor(
    image: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number,
    w: number,
    h: number,
  ) {
    this.image = image;
    this.coordX = canvasWidth / 2 - w / 2;
    this.coordY = canvasHeight - h - 15;
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

  update(leftArrow: boolean, rightArrow: boolean, canvasWidth: number) {
    if (leftArrow) {
      this.coordX -= this.speed;
    }
    if (rightArrow) {
      this.coordX += this.speed;
    }

    if (this.coordX < 0) {
      this.coordX = 0;
    }
    if (this.coordX + this.width > canvasWidth) {
      this.coordX = canvasWidth - this.width;
    }
  }
}
