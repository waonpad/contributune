import { useObserveElementExistence } from "../app/utils/use-observe-element-existense";
import { AudioPlayerRenderer } from "./components/audio-player";
import { OverrideStyles } from "./styles";

export const Content = () => {
  const { elementRef } = useObserveElementExistence({
    appearParams: ['meta[name="route-controller"][content="profiles"]'],
  });

  if (!elementRef.current) return null;

  return (
    <>
      <OverrideStyles />
      <AudioPlayerRenderer />
    </>
  );
};
