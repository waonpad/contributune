import { FileMusic, Pause, Play, X } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { createPortal } from "react-dom";
import { getContribsGraphDataContainer } from "../../app/features/github/utils/element-getters";
import { useObserveElementExistence } from "../../app/utils/use-observe-element-existense";
import { STYLE_PREFIX } from "../styles";

export const AudioControls = ({
  audioPlayingState,
  onFileChange,
  onPlayPuaseToggleButtonClick,
  onStopButtonClick,
  controlsDisabled,
}: {
  audioPlayingState: (typeof AudioContext)["prototype"]["state"];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPlayPuaseToggleButtonClick: () => void;
  onStopButtonClick: () => void;
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
          onChange={onFileChange}
          ref={audioFileInputRef}
          {...{
            [`${STYLE_PREFIX}-audio-file-input`]: "",
          }}
        />
        <div {...{ [`${STYLE_PREFIX}-audio-controls-button-group`]: "" }}>
          <button onClick={onPlayPuaseToggleButtonClick} disabled={controlsDisabled} type="button">
            {audioPlayingState === "running" ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={onStopButtonClick} disabled={controlsDisabled} type="button">
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
    appearParams: [getContribsGraphDataContainer.selectors],
  });

  if (!containerRef.current) return null;

  return createPortal(<AudioControls {...props} />, containerRef.current);
};
