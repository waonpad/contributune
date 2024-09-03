import { useEffect, useState } from "react";
import { AudioPlayerRnederer } from "./components/audio-player";

export const Content = () => {
  const [githubPageType, setGithubPageType] = useState<string | null>(null);

  /**
   * どんなページかを判定して、子コンポーネントのレンダリングを制御する
   */
  useEffect(() => {
    // headタグを取得
    const targetNode = document.head;

    // 監視する変更の設定
    const config = { childList: true, subtree: true, attributes: true };

    // 変更があったときに実行されるコールバック関数
    const callback: MutationCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        // 新しいmetaタグが追加された場合も監視
        if (mutation.type === "childList") {
          const addedMetaElement = [...mutation.addedNodes].find((addedNode) => {
            return (
              (addedNode as Element).tagName === "META" &&
              (addedNode as HTMLMetaElement).getAttribute("name") === "route-controller"
            );
          }) as HTMLMetaElement | undefined;

          if (addedMetaElement) {
            console.log("route-controller metaタグが追加されました");
            console.log(`content属性の値: ${addedMetaElement.getAttribute("content")}`);

            setGithubPageType(addedMetaElement.getAttribute("content"));
          }
        }
      }
    };

    // MutationObserverのインスタンスを作成し、コールバック関数を渡す
    const observer = new MutationObserver(callback);

    // 既存のroute-controller metaタグを探して監視を開始
    const currentMetaElement = document.querySelector<HTMLMetaElement>('meta[name="route-controller"]');

    if (currentMetaElement) {
      console.log("route-controller metaタグが見つかりました");
      console.log(`content属性の値: ${currentMetaElement.getAttribute("content")}`);

      setGithubPageType(currentMetaElement.getAttribute("content"));
    }

    // headタグ全体の監視を開始
    observer.observe(targetNode, config);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!(githubPageType === "profiles")) {
    return null;
  }

  return (
    <>
      <AudioPlayerRnederer />
    </>
  );
};
