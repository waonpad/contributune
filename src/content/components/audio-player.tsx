import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getGitHubYearlyContributionsContainer,
  getGitHubYearlyContributionsGraphDataTableBody,
  getGitHubYearlyContributionsGraphLegend,
} from "../../app/features/github/utils/element-getters";
import { createRoundRectPath } from "../../app/utils/canvas";
import { waitQuerySelector } from "../../app/utils/wait-guery-selector";
import "./override.css";

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
  const audioContext = useRef<AudioContext | null>(null);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioSource = useRef<AudioBufferSourceNode | null>(null);

  const audioAnalyser = useRef<AnalyserNode | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationId = useRef<number | null>(null);

  const tBodyRef = useRef<HTMLTableSectionElement | null>(null);

  const canvasContainerRef = useRef<HTMLTableCellElement | null>(null);

  const colorLevel0Ref = useRef<HTMLDivElement | null>(null);
  const colorLevel4Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // AudioContextを作成
    audioContext.current = new AudioContext();

    // アンマウント時の処理
    return () => {
      (async () => {
        // コンポーネントがアンマウントされたときにAudioContextを終了
        if (audioContext.current) {
          await audioContext.current.close();
        }

        // オーディオの再生を停止
        if (audioSource.current) {
          audioSource.current.stop();
        }

        // キャンバスの描画を停止
        if (animationId.current) {
          cancelAnimationFrame(animationId.current);
          animationId.current = null;
        }
      })();
    };
  }, []);

  useMemo(() => {
    (async () => {
      const tBody = await waitQuerySelector<HTMLTableSectionElement>(
        getGitHubYearlyContributionsGraphDataTableBody.selectors,
        getGitHubYearlyContributionsGraphDataTableBody.node(),
      );

      if (!tBody) return;

      tBodyRef.current = tBody;

      const tds = tBody.querySelectorAll("td");

      canvasContainerRef.current = tds[1];
    })();

    (async () => {
      const colorLevel0 = await waitQuerySelector<HTMLDivElement>(
        getGitHubYearlyContributionsGraphLegend.selectors(0),
        getGitHubYearlyContributionsGraphLegend.node(),
      );

      if (!colorLevel0) return;

      colorLevel0Ref.current = colorLevel0;
    })();

    (async () => {
      const colorLevel4 = await waitQuerySelector<HTMLDivElement>(
        getGitHubYearlyContributionsGraphLegend.selectors(4),
        getGitHubYearlyContributionsGraphLegend.node(),
      );

      if (!colorLevel4) return;

      colorLevel4Ref.current = colorLevel4;
    })();
  }, []);

  const renderFrame = () => {
    if (!canvasRef.current || !audioAnalyser.current) return;

    if (!colorLevel0Ref.current || !colorLevel4Ref.current) return;

    // アナライザーノードのデータを取得
    const bufferLength = audioAnalyser.current.frequencyBinCount;

    // 周波数データを格納するための配列を作成
    const dataArray = new Uint8Array(bufferLength);

    // dataArrayに周波数データを格納
    audioAnalyser.current.getByteFrequencyData(dataArray);

    // キャンバスのコンテキストを取得
    const canvasCtx = canvasRef.current.getContext("2d");

    // キャンバスのコンテキストが取得できない場合は処理を終了
    if (!canvasCtx) return;

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

      let bH = 0;

      // barHeight以下の間、縦に3pxずつスペースをあけて下から上に描画
      while (bH < barHeight) {
        const _ = barHeight - bH;

        const currentBlockHeight = _ < VISUALIZER_SETTINGS.CELL_HEIGHT ? _ : VISUALIZER_SETTINGS.CELL_HEIGHT;

        const currentY = canvasHeight - bH - currentBlockHeight;

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

        bH += currentBlockHeight + VISUALIZER_SETTINGS.CELL_SPACING;
      }
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !audioContext.current) return;

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
    // AudioContextとAudioBufferがある場合のみ再生
    if (audioContext.current && audioBuffer && tBodyRef.current) {
      // 既存のソースがあれば停止する
      if (audioSource.current) {
        audioSource.current.stop();
      }

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
          // これ
          tds[j].setAttribute("data-contributune-audio-playing-style-override-visibility-hidden", "true");

          if (i === 0 && j === 1) {
            // これ
            tds[j].setAttribute("data-contributune-audio-playing-style-override-position-relative", "true");
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
    }
  };

  const stopAudio = () => {
    // オーディオの再生を停止
    if (audioSource.current) {
      audioSource.current.stop();
    }

    // キャンバスの描画を停止
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }

    // キャンバスをクリア
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // スタイルのオーバーライドを解除
    for (const elm of document.querySelectorAll("[data-contributune-audio-playing-style-override-visibility-hidden]")) {
      elm.removeAttribute("data-contributune-audio-playing-style-override-visibility-hidden");
    }

    // スタイルのオーバーライドを解除
    for (const elm of document.querySelectorAll("[data-contributune-audio-playing-style-override-position-relative]")) {
      elm.removeAttribute("data-contributune-audio-playing-style-override-position-relative");
    }
  };

  return (
    <div>
      <input type="file" accept="audio/mpeg" onChange={handleFileChange} />
      <button onClick={playAudio} disabled={!audioBuffer} type="button">
        再生
      </button>
      <button onClick={stopAudio} disabled={!audioBuffer} type="button">
        停止
      </button>
      {(() => {
        if (!canvasContainerRef.current || !tBodyRef.current) return null;

        // TODO: 再生状態で表示を切り替えたいが、拡張機能のHMRがおかしいのか謎の挙動になる
        // キャンバスをクリアーすれば一応見れなくなるので一旦それで対応

        return createPortal(
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
        );
      })()}
    </div>
  );
};

export const AudioPlayerRnederer = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useMemo(async () => {
    const element = await waitQuerySelector<HTMLDivElement>(
      getGitHubYearlyContributionsContainer.selectors,
      getGitHubYearlyContributionsContainer.node(),
    );

    setContainer(element);
  }, []);

  if (!container) return null;

  return createPortal(<AudioPlayer />, container);
};
