import { type ChangeEvent, useReducer } from "react";
import { createPortal } from "react-dom";
import { getContribsContainer } from "../../app/features/github/utils/element-getters";
import { getAudioBufferFromAudioFile } from "../../app/utils/audio";
import { useObserveElementExistence } from "../../app/utils/use-observe-element-existense";
import { VISUALIZER_SETTINGS } from "../constants";
import { useAudio } from "../hooks/use-audio";
import { useVisualizer } from "../hooks/use-visualizer";
import { AudioControlsRenderer } from "./audio-controls";
import { VisualizerRenderer } from "./visualizer";

export const AudioVisualizer = () => {
  const [, reRender] = useReducer((s) => s + 1, 0);

  const { audioBuffer, setAudioBuffer, audioAnalyser, audioCtx, stopAudio, togglePlayPause } = useAudio();

  const { canvasRef, tBodyRef, startRenderFrameLoop, stopRenderFrameLoop } = useVisualizer();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // ファイルが選択されていない場合は処理を終了
    if (!event.target.files || !audioCtx.current) return;

    // 選択されたファイルを取得
    const file = event.target.files[0];
    if (file) {
      setAudioBuffer(await getAudioBufferFromAudioFile({ file, audioCtx: audioCtx.current }));
    } else {
      alert("MP3ファイルを選択してください。");
    }
  };

  const handleStopButtonClick = () => {
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
        audioPlayingState={audioCtx.current?.state ?? "suspended"}
        onFileChange={handleFileChange}
        onPlayPuaseToggleButtonClick={handlePlayPuaseToggleButtonClick}
        onStopButtonClick={handleStopButtonClick}
        controlsDisabled={!audioBuffer}
      />
      {tBodyRef.current && (
        <VisualizerRenderer
          width={tBodyRef.current.clientWidth - VISUALIZER_SETTINGS.MARGIN_LEFT}
          height={tBodyRef.current.clientHeight}
          ref={canvasRef}
        />
      )}
    </>
  );
};

export const AudioVisualizerRenderer = () => {
  const { elementRef: containerRef } = useObserveElementExistence({
    appearParams: [getContribsContainer.selectors],
  });

  if (!containerRef.current) return null;

  return createPortal(<AudioVisualizer />, containerRef.current);
};
