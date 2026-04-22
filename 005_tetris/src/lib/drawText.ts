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
