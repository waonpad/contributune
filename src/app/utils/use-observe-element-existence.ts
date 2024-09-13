import { waitElement } from "@1natsu/wait-element";
import { isNotExist } from "@1natsu/wait-element/detectors";
import { useEffect, useMemo } from "react";
import { useRefWithNotify } from "./use-ref-with-notifiy";

/**
 * 要素の出現と消失を監視する単純なカスタムフック
 */
export const useObserveElementExistence = <T extends Element>({
  appearParams,
  disappearParams,
  onAppear,
  onDisappear,
}: {
  /**
   * 要素の出現を監視するためのパラメータ (オプションのsignalは無視される)
   */
  appearParams: Parameters<typeof waitElement<T>>;
  /**
   * 要素の消失を監視するためのパラメータ (オプションのsignalは無視される) \
   * 指定しない場合は、出現を監視するパラメータが使われる
   */
  disappearParams?: Parameters<typeof waitElement<T>>;
  /**
   * 要素が出現したときに実行する関数
   */
  onAppear?: (element: T) => void;
  /**
   * 要素が消失したときに実行する関数
   */
  onDisappear?: () => void;
}) => {
  const [elementRef, notifyElementRefChange] = useRefWithNotify<T | null>(null);

  /**
   * フックがアンマウントされたときに監視を中止するためのAbortController
   */
  const ac = useMemo(() => new AbortController(), []);

  const waitForElementToAppear = async () => {
    try {
      const element = await waitElement<T>(appearParams[0], {
        signal: ac.signal,
        ...appearParams[1],
      });

      if (onAppear) onAppear(element);

      elementRef.current = element;

      notifyElementRefChange();

      await waitForElementToDisappear();
    } catch (e) {
      // AbortErrorは無視する
      if (ac.signal.aborted) return;

      throw e;
    }
  };

  const waitForElementToDisappear = async () => {
    try {
      await waitElement(disappearParams?.[0] ?? appearParams[0], {
        detector: isNotExist,
        signal: ac.signal,
        ...disappearParams?.[1],
      });

      if (onDisappear) onDisappear();

      elementRef.current = null;

      notifyElementRefChange();

      await waitForElementToAppear();
    } catch (e) {
      // AbortErrorは無視する
      if (ac.signal.aborted) return;

      throw e;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    /**
     * 初回レンダリング時に要素の出現の監視を開始し、以後要素の消失と出現を交互に監視する
     */
    waitForElementToAppear();

    return () => {
      ac.abort("Contributune: Known Abort Error");
    };
  }, []);

  return {
    elementRef,
  };
};
