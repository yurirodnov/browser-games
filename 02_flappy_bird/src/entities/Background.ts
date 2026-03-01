export class Background {
  private image: HTMLImageElement;
  private coordX: number;
  private coordY: number;
  private width: number;
  private height: number;

  constructor(
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.image = img;
    this.coordX = x;
    this.coordY = y;
    this.width = w;
    this.height = h;
  }

  setImage(img: HTMLImageElement): void {
    this.image = img;
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const imgWidth = this.image.width;
    const imgHeight = this.image.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let finalWidth: number;
    let finalHeight: number;
    let x: number;
    let y: number;

    if (canvasRatio > imgRatio) {
      finalWidth = canvasWidth;
      finalHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - finalHeight) / 2;
    } else {
      finalHeight = canvasHeight;
      finalWidth = canvasHeight * imgRatio;
      x = (canvasWidth - finalWidth) / 2;
      y = 0;
    }

    ctx.drawImage(this.image, x, y, finalWidth, finalHeight);
  }

  // draw(ctx: CanvasRenderingContext2D) {
  //   ctx.drawImage(
  //     this.image,
  //     this.coordX,
  //     this.coordY,
  //     this.width,
  //     this.height,
  //   );
  // }
}
