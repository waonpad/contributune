import { useReducer, useRef } from "react";

/**
 * 強制的に再レンダリングさせる関数を同梱したuseRef
 */
export const useRefWithNotify = <T>(initialValue: T) => {
  const ref = useRef<T>(initialValue);
  const [, notifyRefChange] = useReducer((s) => {
    return s + 1;
  }, 0);

  return [ref, notifyRefChange] as const;
};
