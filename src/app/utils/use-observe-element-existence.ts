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
  appearParams: Parameters<typeof waitElement<T>>;
  disappearParams?: Parameters<typeof waitElement<T>>;
  onAppear?: (element: T) => void;
  onDisappear?: () => void;
}) => {
  const [elementRef, notifyElementRefChange] = useRefWithNotify<T | null>(null);

  const ac = useMemo(() => new AbortController(), []);

  const waitForElementToAppear = async () => {
    const element = await waitElement<T>(appearParams[0], {
      signal: ac.signal,
      ...appearParams[1],
    });

    if (onAppear) onAppear(element);

    elementRef.current = element;

    notifyElementRefChange();

    await waitForElementToDisappear();
  };

  const waitForElementToDisappear = async () => {
    await waitElement(disappearParams?.[0] ?? appearParams[0], {
      detector: isNotExist,
      signal: ac.signal,
      ...disappearParams?.[1],
    });

    if (onDisappear) onDisappear();

    elementRef.current = null;

    notifyElementRefChange();

    await waitForElementToAppear();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    waitForElementToAppear();

    return () => {
      ac.abort("Contributune: Known Abort Error");
    };
  }, []);

  return {
    elementRef,
  };
};
