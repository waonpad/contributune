import { createRoundRectPath } from "@/app/utils/canvas";
import { VISUALIZER_SETTINGS as V } from "../constants";

export const fillCanvasLikeContribGraphBg = ({
  canvas,
  canvasCtx,
  fillStyle,
}: {
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  fillStyle: CanvasRenderingContext2D["fillStyle"];
}) => {
  canvasCtx.fillStyle = fillStyle;

  // キャンバス全体に10x10の角丸四角形を3pxずつスペースをあけて描画
  for (let y = 0; y < canvas.height; y += V.CELL_HEIGHT + V.CELL_SPACING) {
    for (let x = 0; x < canvas.width; x += V.CELL_WIDTH + V.CELL_SPACING) {
      createRoundRectPath({
        ctx: canvasCtx,
        x,
        y,
        w: V.CELL_WIDTH,
        h: V.CELL_HEIGHT,
        r: V.CELL_RADIUS,
      });

      canvasCtx.fill();
    }
  }
};

export const fillCanvasLikeContribGraphAsVisualizer = ({
  canvas,
  canvasCtx,
  dataArray,
  fillStyle,
}: {
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  fillStyle: CanvasRenderingContext2D["fillStyle"];
}) => {
  canvasCtx.fillStyle = fillStyle;

  for (let i = 0; i < dataArray.length; i++) {
    // バーの高さはキャンバスの高さに合わせる
    // これは0〜255の値を0〜キャンバスの高さに変換している
    const barHeight = (dataArray[i] / 255) * canvas.height;

    let processedBarHeight = 0;

    // barHeight以下の間、縦に3pxずつスペースをあけて下から上に描画
    while (processedBarHeight < barHeight) {
      const currentBlockHeight =
        barHeight - processedBarHeight < V.CELL_HEIGHT ? barHeight - processedBarHeight : V.CELL_HEIGHT;

      const currentRadius = currentBlockHeight < V.CELL_RADIUS ? currentBlockHeight / 2 : V.CELL_RADIUS;

      createRoundRectPath({
        ctx: canvasCtx,
        x: i * (V.CELL_WIDTH + V.CELL_SPACING),
        y: canvas.height - processedBarHeight - currentBlockHeight,
        w: V.CELL_WIDTH,
        h: currentBlockHeight,
        r: currentRadius,
      });

      canvasCtx.fill();

      processedBarHeight += currentBlockHeight + V.CELL_SPACING;
    }
  }
};
