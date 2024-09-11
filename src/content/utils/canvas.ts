import { createRoundRectPath } from "../../app/utils/canvas";
import { VISUALIZER_SETTINGS } from "../constants";

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
  for (let y = 0; y < canvas.height; y += VISUALIZER_SETTINGS.CELL_HEIGHT + VISUALIZER_SETTINGS.CELL_SPACING) {
    for (let x = 0; x < canvas.width; x += VISUALIZER_SETTINGS.CELL_WIDTH + VISUALIZER_SETTINGS.CELL_SPACING) {
      createRoundRectPath({
        ctx: canvasCtx,
        x,
        y,
        w: VISUALIZER_SETTINGS.CELL_WIDTH,
        h: VISUALIZER_SETTINGS.CELL_HEIGHT,
        r: VISUALIZER_SETTINGS.CELL_RADIUS,
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
        barHeight - processedBarHeight < VISUALIZER_SETTINGS.CELL_HEIGHT
          ? barHeight - processedBarHeight
          : VISUALIZER_SETTINGS.CELL_HEIGHT;

      const currentRadius =
        currentBlockHeight < VISUALIZER_SETTINGS.CELL_RADIUS ? currentBlockHeight / 2 : VISUALIZER_SETTINGS.CELL_RADIUS;

      createRoundRectPath({
        ctx: canvasCtx,
        x: i * (VISUALIZER_SETTINGS.CELL_WIDTH + VISUALIZER_SETTINGS.CELL_SPACING),
        y: canvas.height - processedBarHeight - currentBlockHeight,
        w: VISUALIZER_SETTINGS.CELL_WIDTH,
        h: currentBlockHeight,
        r: currentRadius,
      });

      canvasCtx.fill();

      processedBarHeight += currentBlockHeight + VISUALIZER_SETTINGS.CELL_SPACING;
    }
  }
};
