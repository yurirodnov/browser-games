export class Bird {
  private images: HTMLImageElement[];
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  // PHYSICS
  private velocity: number = 0;
  private gravity: number = 32;
  private jumpPower: number = -58;

  // ROTATION
  private rotation: number = 0;

  // WINGS ANIMATION
  private wingsTimer: number = 0;
  private wingsInterval: number = 0.5;
  private imageIndex: number = 0;

  constructor(
    images: HTMLImageElement[],
    x: number,
    coordY: number,
    w: number,
    h: number,
  ) {
    this.images = images;
    this.coordX = x;
    this.coordY = coordY;
    this.width = w;
    this.height = h;
  }

  private calculateRotation(): void {
    const maxUp = -25 * (Math.PI / 180);
    const maxDown = 300 * (Math.PI / 180);

    let targetRotation: number;

    if (this.velocity < 0) {
      targetRotation = maxUp;
    } else {
      const fallFactor = Math.min(this.velocity / 600, 1);
      targetRotation = maxDown * fallFactor;
    }

    this.rotation += (targetRotation - this.rotation) * 0.1;

    if (this.rotation > maxDown) {
      this.rotation = maxDown;
    }
  }

  public update(jumpNow: boolean, delta: number): void {
    this.wingsTimer += delta;
    if (this.wingsTimer >= this.wingsInterval) {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
      this.wingsTimer = 0;
    }

    if (jumpNow) {
      this.velocity = this.jumpPower;
    }

    this.velocity += this.gravity * delta;

    this.coordY += this.velocity * delta;

    this.calculateRotation();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const currentImage = this.images[this.imageIndex];

    ctx.save();

    const centerX = this.coordX + this.width / 2;
    const centercoordY = this.coordY + this.height / 2;
    ctx.translate(centerX, centercoordY);

    ctx.rotate(this.rotation);

    ctx.drawImage(
      currentImage,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );

    ctx.restore();
  }

  public getCoordX(): number {
    return this.coordX;
  }
  public getCoordY(): number {
    return this.coordY;
  }
  public getWidth(): number {
    return this.width;
  }
  public getHeight(): number {
    return this.height;
  }

  public reset(x: number, coordY: number): void {
    this.coordX = x;
    this.coordY = coordY;
    this.velocity = 0;
    this.rotation = 0;
    this.imageIndex = 0;
  }
}
