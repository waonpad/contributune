import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { getContribsGraphDataTableBody } from "../../app/features/github/utils/element-getters";
import { useObserveElementExistence } from "../../app/utils/use-observe-element-existence";
import { STYLE_PREFIX } from "../styles";

export const Visualizer = forwardRef<HTMLCanvasElement, { width: number; height: number }>(({ width, height }, ref) => {
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
});

export const VisualizerRenderer = forwardRef<HTMLCanvasElement, { width: number; height: number }>((props, ref) => {
  const { elementRef: containerRef } = useObserveElementExistence({
    appearParams: [`${getContribsGraphDataTableBody.selectors} > tr > td:nth-of-type(2)`],
  });

  if (!containerRef.current) return null;

  return createPortal(<Visualizer {...props} ref={ref} />, containerRef.current);
});
