import css from "styled-jsx/css";
import { DATA_ATTR_PREFIX } from "../../app/constants";

export const STYLE_DATA_ATTR_PREFIX = `${DATA_ATTR_PREFIX}-style` as const;

const OVERRIDE_STYLE_DATA_ATTR_PREFIX = `${STYLE_DATA_ATTR_PREFIX}-override` as const;

const OVERRIDE_AUDIO_PLAYING_STYLE_DATA_ATTR_PREFIX = `${OVERRIDE_STYLE_DATA_ATTR_PREFIX}-audio-playing` as const;

export const OVERRIDE_CONTRIB_GRAPH_CELL_AUDIO_PLAYING_STYLE_DATA_ATTR =
  `${OVERRIDE_AUDIO_PLAYING_STYLE_DATA_ATTR_PREFIX}-contrib-graph-cell` as const;
export const OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR =
  `${OVERRIDE_AUDIO_PLAYING_STYLE_DATA_ATTR_PREFIX}-audio-visualizer-container` as const;

export type OverrideStyleKey =
  | typeof OVERRIDE_CONTRIB_GRAPH_CELL_AUDIO_PLAYING_STYLE_DATA_ATTR
  | typeof OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR;

export const overrideStyles = css.global`
  [${OVERRIDE_CONTRIB_GRAPH_CELL_AUDIO_PLAYING_STYLE_DATA_ATTR}] > tr > td:not(:first-child) {
    visibility: hidden;
  }

  [${OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR}] {
    position: relative;
    pointer-events: none;
  }

  /* 再生中だけ表示する */
  [${OVERRIDE_AUDIO_VISUALIZER_CONTAINER_AUDIO_PLAYING_STYLE_DATA_ATTR}] > canvas {
    display: block !important;
    visibility: visible !important;
  }
`;

export const OverrideStyles = () => (
  // biome-ignore lint/style/noImplicitBoolean: <explanation>
  <style jsx global>
    {overrideStyles}
  </style>
);

export const applyOverrideStyle = (element: HTMLElement, overrideStyle: OverrideStyleKey) => {
  element.setAttribute(overrideStyle, "");
};

export const removeOverrideStyle = (element: HTMLElement, overrideStyle: OverrideStyleKey) => {
  element.removeAttribute(overrideStyle);
};

export const removeOverrideStyleFromAllElements = (overrideStyle: OverrideStyleKey) => {
  for (const element of document.querySelectorAll(`[${overrideStyle}]`)) {
    element.removeAttribute(overrideStyle);
  }
};
