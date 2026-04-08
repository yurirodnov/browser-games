export class Ammo {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  private wasPicked: boolean = false;

  constructor(img: HTMLImageElement, x: number, y: number, s: number) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = s;
    this.height = s;
  }

  public getCoordX(): number {
    return this.coordX;
  }

  public getWidth(): number {
    return this.width;
  }

  public getWasPicked(): boolean {
    return this.wasPicked;
  }

  public setPicked(): void {
    this.wasPicked = true;
  }

  public draw(ctx: CanvasRenderingContext2D, worldOffset: number): void {
    ctx.drawImage(this.image, this.coordX + worldOffset, this.coordY, this.width, this.height);
  }
}
