// 003_snake/src/entities/Background.ts

export class Background {
  private image: HTMLImageElement;

  constructor(img: HTMLImageElement) {
    this.image = img;
  }

  draw(ctx: CanvasRenderingContext2D) {}
}
