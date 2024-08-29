import { type ChangeEvent, useMemo } from "react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getGitHubYearlyContributionsContainer } from "../app/features/github/utils/element-getters";
import { waitQuerySelector } from "../app/utils/wait-guery-selector";

/**
 * とりまChatGPTで音声ファイルを再生するだけのコンポーネントを作成した
 */
const AudioPlayer = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      // AudioContextの初期化
      const context = new window.AudioContext();
      setAudioContext(context);

      // ファイルをArrayBufferとして読み込む
      const arrayBuffer = await file.arrayBuffer();

      // ArrayBufferをデコードしてAudioBufferを生成
      const buffer = await context.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    } else {
      alert("MP3ファイルを選択してください。");
    }
  };

  const playAudio = () => {
    if (audioContext && audioBuffer) {
      // 既存のソースがあれば停止する
      if (audioSource.current) {
        audioSource.current.stop();
      }

      // AudioBufferSourceNodeを作成して再生
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);

      // ソースノードを保存しておく
      audioSource.current = source;
    }
  };

  const stopAudio = () => {
    if (audioSource.current) {
      audioSource.current.stop();
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
    </div>
  );
};

const AudioPlayerRnederer = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useMemo(async () => {
    const element = await waitQuerySelector<HTMLDivElement>(
      getGitHubYearlyContributionsContainer.selectors,
      getGitHubYearlyContributionsContainer.node,
    );

    setContainer(element);
  }, []);

  if (!container) return null;

  return createPortal(<AudioPlayer />, container);
};

export const Content = () => {
  return (
    <>
      <AudioPlayerRnederer />
    </>
  );
};
