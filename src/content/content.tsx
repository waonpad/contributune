import { useCallback, useEffect, useMemo, useState } from "react";
import { browser } from "../app/config/browser";
import { AudioPlayerRnederer } from "./components/audio-player";

export const Content = () => {
  const [currentUrl, setCurrentUrl] = useState<string>(location.href);

  const handleBrowserRuntimeMessage: Parameters<(typeof browser.runtime)["onMessage"]["addListener"]>[0] = useCallback(
    (message) => {
      if (message.messageType !== "URL_UPDATED") return;

      setCurrentUrl(message.url);
    },
    [],
  );

  useEffect(() => {
    browser.runtime.onMessage.addListener(handleBrowserRuntimeMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleBrowserRuntimeMessage);
    };
  }, [handleBrowserRuntimeMessage]);

  const isContentActive = useMemo(() => {
    // ユーザープロフィールページのみで有効にする
    // TODO: newやpulls等、予約されているページも有効になってしまう
    const pattern = /^https:\/\/github\.com\/[^\/?]+\/?$/;

    const testResult = pattern.test(currentUrl);

    return testResult;
  }, [currentUrl]);

  // 必要な時だけコンポーネントをレンダリングする
  if (!isContentActive) return null;

  return (
    <>
      <AudioPlayerRnederer />
    </>
  );
};
