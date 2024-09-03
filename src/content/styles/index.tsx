import css from "styled-jsx/css";

const OVERRIDE_STYLES_PREFIX = "data-contributune-audio-playing-style-override" as const;

export const OVERRIDE_VISIBLITY_HIDDEN = `${OVERRIDE_STYLES_PREFIX}-visibility-hidden` as const;
export const OVERRIDE_POSITION_RELATIVE = `${OVERRIDE_STYLES_PREFIX}-position-relative` as const;

export type OverrideStyleKey = typeof OVERRIDE_VISIBLITY_HIDDEN | typeof OVERRIDE_POSITION_RELATIVE;

export const overrideStyles = css.global`
  [${OVERRIDE_VISIBLITY_HIDDEN}] {
    visibility: hidden;
  }

  [${OVERRIDE_POSITION_RELATIVE}] {
    position: relative;
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
