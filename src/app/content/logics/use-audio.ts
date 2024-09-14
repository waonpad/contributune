import { useEffect, useRef, useState } from "react";
import { ANALYSER_SETTINGS } from "../config";

export const useAudio = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioSource = useRef<AudioBufferSourceNode | null>(null);

  const audioAnalyser = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    audioCtx.current = new AudioContext();

    // アンマウント時の処理
    return () => {
      (async () => {
        // コンポーネントがアンマウントされたときにAudioContextを終了
        if (audioCtx.current) await audioCtx.current.close();

        // オーディオの再生を停止
        if (audioSource.current) audioSource.current.stop();
      })();
    };
  }, []);

  const playAudio = () => {
    if (!audioBuffer || !audioCtx.current) return;

    // 既存のソースがあれば停止する
    if (audioSource.current) audioSource.current.stop();

    audioCtx.current = new AudioContext();

    // AudioBufferSourceNodeを作成
    const source = audioCtx.current.createBufferSource();

    // ソースノードにバッファを設定
    source.buffer = audioBuffer;

    // アナライザーノードを作成
    const analyser = audioCtx.current.createAnalyser();

    analyser.fftSize = ANALYSER_SETTINGS.FFT_SIZE;

    // アナライザーノードを保存しておく
    audioAnalyser.current = analyser;

    // ソースノードにアナライザーノードを接続
    source.connect(analyser);

    // アナライザーノードをAudioContextのdestinationに接続
    analyser.connect(audioCtx.current.destination);

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

    if (audioCtx.current) {
      await audioCtx.current.suspend();
    }
  };

  const togglePlayPause = async () => {
    if (audioSource.current) {
      if (audioCtx.current?.state === "running") {
        await audioCtx.current.suspend();

        return "suspended";
      }

      await audioCtx.current?.resume();

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
    audioCtx,
    playAudio,
    stopAudio,
    togglePlayPause,
  };
};
