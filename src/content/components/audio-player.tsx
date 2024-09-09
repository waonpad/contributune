import { FileMusic, Pause, Play, X } from "lucide-react";
import { type ChangeEvent, forwardRef, useEffect, useReducer, useRef, useState } from "react";
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
  OVERRIDE_VISIBILITY_HIDDEN,
  STYLE_PREFIX,
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

const fillContributionGraphBase = ({
  canvas,
  canvasCtx,
  baseCellStyle,
}: {
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  baseCellStyle: CanvasRenderingContext2D["fillStyle"];
}) => {
  canvasCtx.fillStyle = baseCellStyle;

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

const fillVisualizerCanvas = ({
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

const applyOverrideStyleToTContributionGraph = ({
  tBody,
}: {
  tBody: HTMLTableSectionElement;
}) => {
  // テーブルのセルを非表示にする
  const trs = tBody.querySelectorAll("tr");

  for (let i = 0; i < trs.length; i++) {
    const tds = trs[i].querySelectorAll("td");

    for (let j = 1; j < tds.length; j++) {
      applyOverrideStyle(tds[j], OVERRIDE_VISIBILITY_HIDDEN);

      if (i === 0 && j === 1) {
        applyOverrideStyle(tds[j], OVERRIDE_POSITION_RELATIVE);
      }
    }
  }
};

const getFrequencyData = (analyser: AnalyserNode) => {
  // 周波数データを取得
  const bufferLength = analyser.frequencyBinCount;

  // 周波数データを格納するための配列を作成
  const dataArray = new Uint8Array(bufferLength);

  // dataArrayに周波数データを格納
  analyser.getByteFrequencyData(dataArray);

  return dataArray;
};

const getAudioBufferFromAudioFile = async ({
  file,
  audioContext,
}: {
  file: File;
  audioContext: AudioContext;
}) => {
  if (file.type !== "audio/mpeg") {
    throw new Error("MP3ファイルを選択してください。");
  }

  // ファイルをArrayBufferとして読み込む
  const arrayBuffer = await file.arrayBuffer();

  // ArrayBufferをデコードしてAudioBufferを生成
  return await audioContext.decodeAudioData(arrayBuffer);
};

export const AudioControls = ({
  audioPlayingState,
  handleFileChange,
  handlePlayPuaseToggleButtonClick,
  stopAudio,
  controlsDisabled,
}: {
  audioPlayingState: (typeof AudioContext)["prototype"]["state"];
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePlayPuaseToggleButtonClick: () => void;
  stopAudio: () => void;
  controlsDisabled: boolean;
}) => {
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAudioFileInputButtonClick = () => {
    audioFileInputRef.current?.click();
  };

  return (
    <>
      <div
        {...{
          [`${STYLE_PREFIX}-audio-controls-container`]: "",
        }}
      >
        <button onClick={handleAudioFileInputButtonClick} type="button">
          <FileMusic size={18} />
        </button>
        <input
          type="file"
          accept="audio/mpeg"
          onChange={handleFileChange}
          ref={audioFileInputRef}
          {...{
            [`${STYLE_PREFIX}-audio-file-input`]: "",
          }}
        />
        <div {...{ [`${STYLE_PREFIX}-audio-controls-button-group`]: "" }}>
          <button onClick={handlePlayPuaseToggleButtonClick} disabled={controlsDisabled} type="button">
            {audioPlayingState === "running" ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={stopAudio} disabled={controlsDisabled} type="button">
            <X size={18} />
          </button>
        </div>
      </div>
      {/* biome-ignore lint/style/noImplicitBoolean: <explanation> */}
      <style jsx>
        {`
      [${STYLE_PREFIX}-audio-controls-container] {
        font-size: 12px;
        padding-top: 4px;
        padding-bottom: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 8px;
      }

      [${STYLE_PREFIX}-audio-controls-container] button {
        cursor: pointer;
        background-color: transparent;
        border: solid 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        border-radius: 0.375rem;
        color: var(--fgColor-muted);
      }

      [${STYLE_PREFIX}-audio-controls-container] button:hover {
        color: var(--fgColor-emphasis);
      }

      [${STYLE_PREFIX}-audio-controls-container] button:disabled {
        cursor: not-allowed;
        color: var(--fgColor-disabled);
      }

      [${STYLE_PREFIX}-audio-file-input] {
        display: none;
      }

      [${STYLE_PREFIX}-audio-controls-button-group] {
        display: flex;
      }

      [${STYLE_PREFIX}-audio-controls-button-group] button:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right-width: 0.5px;
      }

      [${STYLE_PREFIX}-audio-controls-button-group] button:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0.5px;
      }
    `}
      </style>
    </>
  );
};

export const AudioControlsRenderer = (props: Parameters<typeof AudioControls>[0]) => {
  const { elementRef: containerRef } = useObserveElementExistence<HTMLDivElement>({
    appearParams: [getGitHubYearlyContributionsGraphDataContainer.selectors],
  });

  if (!containerRef.current) return null;

  return createPortal(<AudioControls {...props} />, containerRef.current);
};

export const VisualizerCanvas = forwardRef<HTMLCanvasElement, { width: number; height: number }>(
  ({ width, height }, ref) => {
    return (
      <>
        <canvas
          ref={ref}
          width={width}
          height={height}
          {...{
            [`${STYLE_PREFIX}-audio-visualizer-canvas`]: "",
          }}
        />
        {/* biome-ignore lint/style/noImplicitBoolean: <explanation> */}
        <style jsx>
          {`
        [${STYLE_PREFIX}-audio-visualizer-canvas] {
          position: absolute;
          top: 0;
          left: 0;
          visibility: visible;
        }
      `}
        </style>
      </>
    );
  },
);

export const VisualizerCanvasRenderer = forwardRef<HTMLCanvasElement, { width: number; height: number }>(
  (props, ref) => {
    const { elementRef: containerRef } = useObserveElementExistence({
      appearParams: [`${getGitHubYearlyContributionsGraphDataTableBody.selectors} > tr > td:nth-of-type(2)`],
    });

    if (!containerRef.current) return null;

    return createPortal(<VisualizerCanvas {...props} ref={ref} />, containerRef.current);
  },
);

export const useAudio = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioSource = useRef<AudioBufferSourceNode | null>(null);

  const audioAnalyser = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    audioContext.current = new AudioContext();

    // アンマウント時の処理
    return () => {
      (async () => {
        // コンポーネントがアンマウントされたときにAudioContextを終了
        if (audioContext.current) await audioContext.current.close();

        // オーディオの再生を停止
        if (audioSource.current) audioSource.current.stop();
      })();
    };
  }, []);

  const playAudio = () => {
    if (!audioBuffer || !audioContext.current) return;

    // 既存のソースがあれば停止する
    if (audioSource.current) audioSource.current.stop();

    audioContext.current = new AudioContext();

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

    // オーディオの再生を開始
    source.start(0);
  };

  const stopAudio = async () => {
    // オーディオの再生を停止
    if (audioSource.current) {
      audioSource.current.stop();
      audioSource.current = null;
    }

    if (audioContext.current) {
      await audioContext.current.suspend();
    }
  };

  const togglePlayPause = async () => {
    if (audioSource.current) {
      if (audioContext.current?.state === "running") {
        await audioContext.current.suspend();

        return "suspended";
      }

      await audioContext.current?.resume();

      return "resumed";
    }

    playAudio();

    return "started";
  };

  return {
    audioBuffer,
    setAudioBuffer,
    audioSource,
    audioAnalyser,
    audioContext,
    playAudio,
    stopAudio,
    togglePlayPause,
  };
};

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationId = useRef<number | null>(null);

  const { elementRef: tBodyRef } = useObserveElementExistence<HTMLTableSectionElement>({
    appearParams: [getGitHubYearlyContributionsGraphDataTableBody.selectors],
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
    fillContributionGraphBase({
      canvas: canvasRef.current,
      canvasCtx,
      baseCellStyle: getComputedStyle(colorLevel0Ref.current).backgroundColor,
    });

    // キャンバスに周波数データを描画
    fillVisualizerCanvas({
      canvas: canvasRef.current,
      canvasCtx,
      dataArray,
      fillStyle: getComputedStyle(colorLevel4Ref.current).backgroundColor,
    });
  };

  const startRenderFrameLoop = (analyser: AnalyserNode) => {
    if (!tBodyRef.current) return;

    // テーブルのセルを非表示にする
    applyOverrideStyleToTContributionGraph({ tBody: tBodyRef.current });

    // キャンバスの描画を無限ループで行う処理を開始
    animationId.current = requestAnimationFrame(function loop() {
      renderFrame(getFrequencyData(analyser));
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

export const AudioPlayer = () => {
  const [, reRender] = useReducer((s) => s + 1, 0);

  const { audioBuffer, setAudioBuffer, audioAnalyser, audioContext, stopAudio, togglePlayPause } = useAudio();

  const { canvasRef, tBodyRef, startRenderFrameLoop, stopRenderFrameLoop } = useCanvas();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // ファイルが選択されていない場合は処理を終了
    if (!event.target.files || !audioContext.current) return;

    // 選択されたファイルを取得
    const file = event.target.files[0];
    if (file) {
      setAudioBuffer(await getAudioBufferFromAudioFile({ file, audioContext: audioContext.current }));
    } else {
      alert("MP3ファイルを選択してください。");
    }
  };

  const stop = async () => {
    stopAudio();

    stopRenderFrameLoop();

    reRender();
  };

  const handlePlayPuaseToggleButtonClick = async () => {
    const state = await togglePlayPause();

    if (state === "started") {
      startRenderFrameLoop(audioAnalyser.current as AnalyserNode);
    }

    reRender();
  };

  return (
    <>
      <AudioControlsRenderer
        audioPlayingState={audioContext.current?.state ?? "suspended"}
        handleFileChange={handleFileChange}
        handlePlayPuaseToggleButtonClick={handlePlayPuaseToggleButtonClick}
        stopAudio={stop}
        controlsDisabled={!audioBuffer}
      />
      {tBodyRef.current && (
        <VisualizerCanvasRenderer
          width={tBodyRef.current.clientWidth - VISUALIZER_SETTINGS.MARGIN_LEFT}
          height={tBodyRef.current.clientHeight}
          ref={canvasRef}
        />
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
