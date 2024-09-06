import { useObserveElementExistence } from "../app/utils/use-observe-element-existense";
import { AudioPlayerRenderer } from "./components/audio-player";
import { OverrideStyles } from "./styles";

const selector = 'meta[name="route-controller"][content="profiles"]';

export const Content = () => {
  const { elementRef } = useObserveElementExistence({
    appearParams: [selector],
    onAppear: (elm) => {
      console.log("GitHubのプロフィールページかどうかを判定するための要素が出現しました", elm);
    },
    onDisappear: () => {
      console.log("GitHubのプロフィールページかどうかを判定するための要素が消失しました");
    },
  });

  if (!elementRef.current) {
    return null;
  }

  return (
    <>
      <OverrideStyles />
      <AudioPlayerRenderer />
    </>
  );
};
