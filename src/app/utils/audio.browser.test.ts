import { describe, expect, it } from "vitest";
import { getUint8ArrayFromAnalyser } from "./audio";

describe(getUint8ArrayFromAnalyser, () => {
  it("Uint8Arrayを返す", () => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    const result = getUint8ArrayFromAnalyser(analyser);

    expect(result).toBeInstanceOf(Uint8Array);
  });
});
