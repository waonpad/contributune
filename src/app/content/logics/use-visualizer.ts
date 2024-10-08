import { getUint8ArrayFromAnalyser } from "@/utils/audio";
import { getContribGraphDataTableBody, getContribGraphLegend } from "@/utils/github/element-getters";
import { useObserveElementExistence } from "@/utils/use-observe-element-existence";
import { useEffect, useRef } from "react";
import {
  OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR,
  OVERRIDE_CONTRIB_GRAPH_CELL_AUDIO_PLAYING_STYLE_DATA_ATTR,
  applyOverrideStyle,
  removeOverrideStyleFromAllElements,
} from "../styles";
import { fillCanvasLikeContribGraphAsVisualizer, fillCanvasLikeContribGraphBg } from "./canvas";

export const useVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationId = useRef<number | null>(null);

  const { elementRef: tBodyRef } = useObserveElementExistence<HTMLTableSectionElement>({
    appearParams: [getContribGraphDataTableBody.selectors],
  });

  const { elementRef: colorLevel0Ref } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getContribGraphLegend.selectors(0)],
  });

  const { elementRef: colorLevel4Ref } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getContribGraphLegend.selectors(4)],
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

    // 背景塗りつぶし用の色を取得
    canvasCtx.fillStyle = getComputedStyle(colorLevel0Ref.current).backgroundColor;

    // キャンバスの背景を塗りつぶす
    fillCanvasLikeContribGraphBg({
      canvas: canvasRef.current,
      canvasCtx,
    });

    // 周波数データの描画用の色を取得
    canvasCtx.fillStyle = getComputedStyle(colorLevel4Ref.current).backgroundColor;

    // キャンバスに周波数データを描画
    fillCanvasLikeContribGraphAsVisualizer({
      canvas: canvasRef.current,
      canvasCtx,
      dataArray,
    });
  };

  const startRenderFrameLoop = (analyser: AnalyserNode) => {
    if (!tBodyRef.current) return;

    // テーブルのセルを非表示にする
    applyOverrideStyle(tBodyRef.current, OVERRIDE_CONTRIB_GRAPH_CELL_AUDIO_PLAYING_STYLE_DATA_ATTR);

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const visualizerContainer = tBodyRef.current.querySelector<HTMLTableCellElement>("tr > td:nth-child(2)")!;

    applyOverrideStyle(visualizerContainer, OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR);

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
    removeOverrideStyleFromAllElements(OVERRIDE_CONTRIB_GRAPH_CELL_AUDIO_PLAYING_STYLE_DATA_ATTR);
    removeOverrideStyleFromAllElements(OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR);
  };

  return { canvasRef, renderFrame, animationId, tBodyRef, startRenderFrameLoop, stopRenderFrameLoop };
};
