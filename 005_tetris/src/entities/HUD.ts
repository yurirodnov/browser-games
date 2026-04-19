export class HUD {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    //console.log("drawing hud");
    ctx.drawImage(this.image, this.coordX, this.coordY, this.width, this.height);
  }
}
