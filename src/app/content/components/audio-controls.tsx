import { getContribGraphDataContainer } from "@/utils/github/element-getters";
import { useObserveElementExistence } from "@/utils/use-observe-element-existence";
import { FileMusic, Pause, Play, X } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { createPortal } from "react-dom";
import { STYLE_DATA_ATTR_PREFIX as DS } from "../styles";

export const AudioControls = ({
  audioPlayingState,
  onFileChange,
  onPlayPauseToggleButtonClick,
  onStopButtonClick,
  controlsDisabled,
}: {
  audioPlayingState: (typeof AudioContext)["prototype"]["state"];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPlayPauseToggleButtonClick: () => void;
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
          [`${DS}-audio-controls-container`]: "",
        }}
      >
        <button
          onClick={handleAudioFileInputButtonClick}
          type="button"
          title="Chrome拡張機能 Contributune によってページに挿入された要素です&#10;ボタンをクリックして、再生したいオーディオファイルを選択します"
        >
          <FileMusic size={18} />
        </button>
        <input
          type="file"
          accept="audio/mpeg"
          onChange={onFileChange}
          ref={audioFileInputRef}
          {...{
            [`${DS}-audio-file-input`]: "",
          }}
        />
        <div {...{ [`${DS}-audio-controls-button-group`]: "" }}>
          <button
            onClick={onPlayPauseToggleButtonClick}
            disabled={controlsDisabled}
            type="button"
            title="Chrome拡張機能 Contributune によってページに挿入された要素です&#10;オーディオファイルを選択した後、ボタンをクリックして再生または一時停止を行います"
          >
            {audioPlayingState === "running" ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={onStopButtonClick}
            disabled={controlsDisabled}
            type="button"
            title="Chrome拡張機能 Contributune によってページに挿入された要素です&#10;ボタンをクリックして、再生中のオーディオを停止します"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      {/* biome-ignore lint/style/noImplicitBoolean: <explanation> */}
      <style jsx>
        {`
      [${DS}-audio-controls-container] {
        font-size: 12px;
        padding-top: 4px;
        padding-bottom: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 8px;
      }

      [${DS}-audio-controls-container] button {
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

      [${DS}-audio-controls-container] button:hover {
        color: var(--fgColor-emphasis);
      }

      [${DS}-audio-controls-container] button:disabled {
        cursor: not-allowed;
        color: var(--fgColor-disabled);
      }

      [${DS}-audio-file-input] {
        display: none;
      }

      [${DS}-audio-controls-button-group] {
        display: flex;
      }

      [${DS}-audio-controls-button-group] button:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right-width: 0.5px;
      }

      [${DS}-audio-controls-button-group] button:last-child {
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
    appearParams: [getContribGraphDataContainer.selectors],
  });

  if (!containerRef.current) return null;

  return createPortal(<AudioControls {...props} />, containerRef.current);
};
