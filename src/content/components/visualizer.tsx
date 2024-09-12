import { getContribGraphDataTableBody } from "@/app/utils/github/element-getters";
import { useObserveElementExistence } from "@/app/utils/use-observe-element-existence";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { STYLE_DATA_ATTR_PREFIX as DS } from "../styles";

export const Visualizer = forwardRef<HTMLCanvasElement, { width: number; height: number }>(({ width, height }, ref) => {
  return (
    <>
      <canvas
        ref={ref}
        width={width}
        height={height}
        {...{
          [`${DS}-audio-visualizer-canvas`]: "",
        }}
        title="Chrome拡張機能 Contributune によってページに挿入された要素です&#10;オーディオの波形を可視化します"
      />
      {/* biome-ignore lint/style/noImplicitBoolean: <explanation> */}
      <style jsx>
        {`
        [${DS}-audio-visualizer-canvas] {
          position: absolute;
          top: 0;
          left: 0;
          // 再生中だけ表示するよう別の場所から上書きする
          display: none;
        }
      `}
      </style>
    </>
  );
});

export const VisualizerRenderer = forwardRef<HTMLCanvasElement, { width: number; height: number }>((props, ref) => {
  const { elementRef: containerRef } = useObserveElementExistence({
    // 再生前にcreatePortalを実行可能にする
    appearParams: [`${getContribGraphDataTableBody.selectors} > tr > td:nth-child(2)`],
  });

  if (!containerRef.current) return null;

  return createPortal(<Visualizer {...props} ref={ref} />, containerRef.current);
});
