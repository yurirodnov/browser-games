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

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Реальные размеры картинки
    const imgWidth = this.image.width;
    const imgHeight = this.image.height;

    // Вычисляем соотношения сторон
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let finalWidth: number;
    let finalHeight: number;
    let x: number;
    let y: number;

    // Подбираем размеры, чтобы заполнить весь экран (как object-fit: cover в CSS)
    if (canvasRatio > imgRatio) {
      // Канвас шире картинки -> растягиваем по ширине, обрезаем высоту
      finalWidth = canvasWidth;
      finalHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - finalHeight) / 2; // Центрируем по вертикали
    } else {
      // Канвас уже картинки -> растягиваем по высоте, обрезаем ширину
      finalHeight = canvasHeight;
      finalWidth = canvasHeight * imgRatio;
      x = (canvasWidth - finalWidth) / 2; // Центрируем по горизонтали
      y = 0;
    }

    // Рисуем с рассчитанными координатами и размерами
    ctx.drawImage(this.image, x, y, finalWidth, finalHeight);
  }
}
