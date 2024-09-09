import { useEffect, useRef } from "react";
import { getContribsGraphDataTableBody, getContribsGraphLegend } from "../../app/features/github/utils/element-getters";
import { getUint8ArrayFromAnalyser } from "../../app/utils/audio";
import { useObserveElementExistence } from "../../app/utils/use-observe-element-existense";
import {
  OVERRIDE_POSITION_RELATIVE,
  OVERRIDE_VISIBILITY_HIDDEN,
  applyOverrideStyle,
  removeOverrideStyleFromAllElements,
} from "../styles";
import { fillCanvasLikeContribsGraphAsVisuarizer, fillCanvasLikeContribsGraphBg } from "../utils/canvas";

export const useVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationId = useRef<number | null>(null);

  const { elementRef: tBodyRef } = useObserveElementExistence<HTMLTableSectionElement>({
    appearParams: [getContribsGraphDataTableBody.selectors],
  });

  const { elementRef: colorLevel0Ref } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getContribsGraphLegend.selectors(0)],
  });

  const { elementRef: colorLevel4Ref } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getContribsGraphLegend.selectors(4)],
  });

  useEffect(() => {
    // アンマウント時の処理
    return () => {
      (async () => {
        // キャンバスの描画を停止
        if (animationId.current) {
          cancelAnimationFrame(animationId.current);
          animationId.current = null;
        }
      })();
    };
  }, []);

  const renderFrame = (dataArray: Uint8Array) => {
    // 処理に必要なリソースが揃っていない場合は処理を終了
    if (!canvasRef.current || !colorLevel0Ref.current || !colorLevel4Ref.current) return;

    // キャンバスのコンテキストを取得
    const canvasCtx = canvasRef.current.getContext("2d");

    // キャンバスのコンテキストが取得できない場合は処理を終了
    if (!canvasCtx) return;

    // キャンバスを初期化
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // キャンバスの背景を塗りつぶす
    fillCanvasLikeContribsGraphBg({
      canvas: canvasRef.current,
      canvasCtx,
      fillStyle: getComputedStyle(colorLevel0Ref.current).backgroundColor,
    });

    // キャンバスに周波数データを描画
    fillCanvasLikeContribsGraphAsVisuarizer({
      canvas: canvasRef.current,
      canvasCtx,
      dataArray,
      fillStyle: getComputedStyle(colorLevel4Ref.current).backgroundColor,
    });
  };

  const startRenderFrameLoop = (analyser: AnalyserNode) => {
    if (!tBodyRef.current) return;

    // テーブルのセルを非表示にする
    const trs = tBodyRef.current.querySelectorAll("tr");

    for (let i = 0; i < trs.length; i++) {
      const tds = trs[i].querySelectorAll("td");

      for (let j = 1; j < tds.length; j++) {
        applyOverrideStyle(tds[j], OVERRIDE_VISIBILITY_HIDDEN);

        if (i === 0 && j === 1) {
          applyOverrideStyle(tds[j], OVERRIDE_POSITION_RELATIVE);
        }
      }
    }

    // キャンバスの描画を無限ループで行う処理を開始
    animationId.current = requestAnimationFrame(function loop() {
      renderFrame(getUint8ArrayFromAnalyser(analyser));
      animationId.current = requestAnimationFrame(loop);
    });
  };

  const stopRenderFrameLoop = () => {
    // キャンバスの描画を停止
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }

    // キャンバスをクリア
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // スタイルのオーバーライドを解除
    removeOverrideStyleFromAllElements(OVERRIDE_VISIBILITY_HIDDEN);
    removeOverrideStyleFromAllElements(OVERRIDE_POSITION_RELATIVE);
  };

  return { canvasRef, renderFrame, animationId, tBodyRef, startRenderFrameLoop, stopRenderFrameLoop };
};
