/**
 * 角が丸い四角形のパスを作成する
 *
 * 描画はこの関数では行わない \
 * `CanvasRenderingContext2D.stroke()` や `CanvasRenderingContext2D.fill()` などで描画する
 */
export const createRoundRectPath = ({
  ctx,
  x,
  y,
  w,
  h,
  r,
}: { ctx: CanvasRenderingContext2D; x: number; y: number; w: number; h: number; r: number }) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, Math.PI * (3 / 2), 0, false);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1 / 2), false);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI * (1 / 2), Math.PI, false);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3 / 2), false);
  ctx.closePath();
};
