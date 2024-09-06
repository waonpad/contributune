import { type ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getGitHubYearlyContributionsContainer,
  getGitHubYearlyContributionsGraphDataContainer,
  getGitHubYearlyContributionsGraphDataTableBody,
  getGitHubYearlyContributionsGraphLegend,
} from "../../app/features/github/utils/element-getters";
import { createRoundRectPath } from "../../app/utils/canvas";
import { useObserveElementExistence } from "../../app/utils/use-observe-element-existense";
import {
  OVERRIDE_POSITION_RELATIVE,
  OVERRIDE_VISIBLITY_HIDDEN,
  applyOverrideStyle,
  removeOverrideStyleFromAllElements,
} from "../styles";

type AnalyserNodeFFTSize = 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;

const ANALYSER_SETTINGS = {
  /**
   * これの半分の値が周波数データの数になる
   */
  FFT_SIZE: 128 satisfies AnalyserNodeFFTSize,
} as const;

const VISUALIZER_SETTINGS = {
  CELL_WIDTH: 10,
  CELL_HEIGHT: 10,
  CELL_RADIUS: 2,
  CELL_SPACING: 3,
  MARGIN_LEFT: 31,
} as const;

export const AudioPlayer = () => {
  const [, reRender] = useReducer((s) => s + 1, 0);

  const audioContext = useRef<AudioContext>(new AudioContext());

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioSource = useRef<AudioBufferSourceNode | null>(null);

  const audioAnalyser = useRef<AnalyserNode | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationId = useRef<number | null>(null);

  const { elementRef: tBodyRef } = useObserveElementExistence<HTMLTableSectionElement>({
    appearParams: [getGitHubYearlyContributionsGraphDataTableBody.selectors],
  });

  const { elementRef: canvasContainerRef } = useObserveElementExistence({
    appearParams: [`${getGitHubYearlyContributionsGraphDataTableBody.selectors} > tr > td:nth-of-type(2)`],
  });

  const { elementRef: audioControlsContainerRef } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getGitHubYearlyContributionsGraphDataContainer.selectors],
  });

  const { elementRef: colorLevel0Ref } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getGitHubYearlyContributionsGraphLegend.selectors(0)],
  });

  const { elementRef: colorLevel4Ref } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getGitHubYearlyContributionsGraphLegend.selectors(4)],
  });

  useEffect(() => {
    // アンマウント時の処理
    return () => {
      (async () => {
        // コンポーネントがアンマウントされたときにAudioContextを終了
        if (audioContext.current) await audioContext.current.close();

        // オーディオの再生を停止
        if (audioSource.current) audioSource.current.stop();

        // キャンバスの描画を停止
        if (animationId.current) {
          cancelAnimationFrame(animationId.current);
          animationId.current = null;
        }
      })();
    };
  }, []);

  const renderFrame = () => {
    // 処理に必要なリソースが揃っていない場合は処理を終了
    if (!canvasRef.current || !audioAnalyser.current || !colorLevel0Ref.current || !colorLevel4Ref.current) return;

    // キャンバスのコンテキストを取得
    const canvasCtx = canvasRef.current.getContext("2d");

    // キャンバスのコンテキストが取得できない場合は処理を終了
    if (!canvasCtx) return;

    // アナライザーノードのデータを取得
    const bufferLength = audioAnalyser.current.frequencyBinCount;

    // 周波数データを格納するための配列を作成
    const dataArray = new Uint8Array(bufferLength);

    // dataArrayに周波数データを格納
    audioAnalyser.current.getByteFrequencyData(dataArray);

    // キャンバスを初期化
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const canvasHeight = canvasRef.current.height;

    canvasCtx.fillStyle = getComputedStyle(colorLevel0Ref.current).backgroundColor;

    // キャンバス全体に10x10の角丸四角形を3pxずつスペースをあけて描画
    for (let y = 0; y < canvasHeight; y += VISUALIZER_SETTINGS.CELL_HEIGHT + VISUALIZER_SETTINGS.CELL_SPACING) {
      for (
        let x = 0;
        x < canvasRef.current.width;
        x += VISUALIZER_SETTINGS.CELL_WIDTH + VISUALIZER_SETTINGS.CELL_SPACING
      ) {
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

    for (let i = 0; i < dataArray.length; i++) {
      // バーの高さはキャンバスの高さに合わせる
      // これは0〜255の値を0〜キャンバスの高さに変換している
      const barHeight = (dataArray[i] / 255) * canvasHeight;

      const x = i * (VISUALIZER_SETTINGS.CELL_WIDTH + VISUALIZER_SETTINGS.CELL_SPACING);

      canvasCtx.fillStyle = getComputedStyle(colorLevel4Ref.current).backgroundColor;

      let processedBarHeight = 0;

      // barHeight以下の間、縦に3pxずつスペースをあけて下から上に描画
      while (processedBarHeight < barHeight) {
        const currentBlockHeight =
          barHeight - processedBarHeight < VISUALIZER_SETTINGS.CELL_HEIGHT
            ? barHeight - processedBarHeight
            : VISUALIZER_SETTINGS.CELL_HEIGHT;

        const currentY = canvasHeight - processedBarHeight - currentBlockHeight;

        const currentRadius =
          currentBlockHeight < VISUALIZER_SETTINGS.CELL_RADIUS
            ? currentBlockHeight / 2
            : VISUALIZER_SETTINGS.CELL_RADIUS;

        createRoundRectPath({
          ctx: canvasCtx,
          x,
          y: currentY,
          w: VISUALIZER_SETTINGS.CELL_WIDTH,
          h: currentBlockHeight,
          r: currentRadius,
        });

        canvasCtx.fill();

        processedBarHeight += currentBlockHeight + VISUALIZER_SETTINGS.CELL_SPACING;
      }
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // ファイルが選択されていない場合は処理を終了
    if (!event.target.files) return;

    // 選択されたファイルを取得
    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      // JSで音声をオーディオ操作するための前処理

      // ファイルをArrayBufferとして読み込む
      const arrayBuffer = await file.arrayBuffer();

      // ArrayBufferをデコードしてAudioBufferを生成
      const buffer = await audioContext.current.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    } else {
      alert("MP3ファイルを選択してください。");
    }
  };

  const playAudio = () => {
    // 処理に必要なリソースが揃っていない場合は処理を終了
    if (!audioBuffer || !tBodyRef.current) return;

    // 既存のソースがあれば停止する
    if (audioSource.current) audioSource.current.stop();

    // AudioBufferSourceNodeを作成
    const source = audioContext.current.createBufferSource();

    // ソースノードにバッファを設定
    source.buffer = audioBuffer;

    // アナライザーノードを作成
    const analyser = audioContext.current.createAnalyser();

    analyser.fftSize = ANALYSER_SETTINGS.FFT_SIZE;

    // アナライザーノードを保存しておく
    audioAnalyser.current = analyser;

    // ソースノードにアナライザーノードを接続
    source.connect(analyser);

    // アナライザーノードをAudioContextのdestinationに接続
    analyser.connect(audioContext.current.destination);

    // ソースノードを保存しておく
    audioSource.current = source;

    // テーブルのセルを非表示にする
    const trs = tBodyRef.current.querySelectorAll("tr");

    for (let i = 0; i < trs.length; i++) {
      const tds = trs[i].querySelectorAll("td");

      for (let j = 1; j < tds.length; j++) {
        applyOverrideStyle(tds[j], OVERRIDE_VISIBLITY_HIDDEN);

        if (i === 0 && j === 1) {
          applyOverrideStyle(tds[j], OVERRIDE_POSITION_RELATIVE);
        }
      }
    }

    // オーディオの再生を開始
    source.start(0);

    // キャンバスの描画を無限ループで行う処理を開始
    animationId.current = requestAnimationFrame(function loop() {
      renderFrame();
      animationId.current = requestAnimationFrame(loop);
    });

    reRender();
  };

  const stopAudio = () => {
    // オーディオの再生を停止
    if (audioSource.current) audioSource.current.stop();

    // キャンバスの描画を停止
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }

    // キャンバスをクリア
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // スタイルのオーバーライドを解除
    removeOverrideStyleFromAllElements(OVERRIDE_VISIBLITY_HIDDEN);
    removeOverrideStyleFromAllElements(OVERRIDE_POSITION_RELATIVE);

    reRender();
  };

  return (
    <>
      {audioControlsContainerRef.current &&
        createPortal(
          <div
            style={{
              fontSize: 12,
              paddingTop: 4,
              paddingBottom: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <input type="file" accept="audio/mpeg" onChange={handleFileChange} />
            <button onClick={playAudio} disabled={!audioBuffer} type="button">
              再生
            </button>
            <button onClick={stopAudio} disabled={!audioBuffer} type="button">
              停止
            </button>
          </div>,
          audioControlsContainerRef.current,
        )}
      {canvasContainerRef.current &&
        tBodyRef.current &&
        audioContext.current.state === "running" &&
        createPortal(
          <canvas
            ref={canvasRef}
            width={tBodyRef.current.clientWidth - VISUALIZER_SETTINGS.MARGIN_LEFT}
            height={tBodyRef.current.clientHeight}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              visibility: "visible",
            }}
          />,
          canvasContainerRef.current,
        )}
    </>
  );
};

export const AudioPlayerRenderer = () => {
  const { elementRef: containerRef } = useObserveElementExistence({
    appearParams: [getGitHubYearlyContributionsContainer.selectors],
  });

  if (!containerRef.current) return null;

  return createPortal(<AudioPlayer />, containerRef.current);
};
