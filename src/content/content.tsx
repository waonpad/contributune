import { useObserveElementExistence } from "../app/utils/use-observe-element-existence";
import { AudioVisualizerRenderer } from "./components/audio-visualizer";
import { OverrideStyles } from "./styles";

export const Content = () => {
  const { elementRef } = useObserveElementExistence({
    appearParams: ['meta[name="route-controller"][content="profiles"]'],
  });

  if (!elementRef.current) return null;

  return (
    <>
      <OverrideStyles />
      <AudioVisualizerRenderer />
    </>
  );
};
