export const drawText = (
  ctx: CanvasRenderingContext2D,
  align: CanvasTextAlign,
  text: string,
  font: string,
  strokeColor: string,
  fillColor: string,
  x: number,
  y: number,
): void => {
  ctx.textAlign = align;
  ctx.font = font;
  ctx.strokeStyle = strokeColor;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
};

export const drawLetters = (
  ctx: CanvasRenderingContext2D,
  align: CanvasTextAlign,
  letters: string[],
  font: string,
  strokeColor: string,
  fillColor: string | string[],
  x: number,
  y: number,
  gap: number,
): void => {
  ctx.textAlign = align;
  ctx.font = font;

  if (Array.isArray(fillColor)) {
    let coordX = x;
    for (let i = 0; i < fillColor.length; i += 1) {
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(letters[i], coordX, y);
      ctx.fillStyle = fillColor[i];
      ctx.fillText(letters[i], coordX, y);

      coordX += gap;
    }
  } else {
    let coordX = x;
    for (let i = 0; i < fillColor.length; i += 1) {
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(letters[i], coordX, y);
      ctx.fillStyle = fillColor;
      ctx.fillText(letters[i], coordX, y);

      coordX += gap;
    }
  }
};
