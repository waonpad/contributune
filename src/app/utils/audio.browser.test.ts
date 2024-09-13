import audioArrayBuffer from "@/test/fixtures/files/audio.mp3?arraybuffer";
import textArrayBuffer from "@/test/fixtures/files/text.txt?arraybuffer";
import { describe, expect, it } from "vitest";
import { getAudioBufferFromAudioFile, getUint8ArrayFromAnalyser } from "./audio";

describe(getUint8ArrayFromAnalyser, () => {
  it("Uint8Arrayを返す", () => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    const result = getUint8ArrayFromAnalyser(analyser);

    expect(result).toBeInstanceOf(Uint8Array);
  });

  it("Uint8Arrayの長さはAnalyserNode.frequencyBinCountと等しい", () => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    const result = getUint8ArrayFromAnalyser(analyser);

    expect(result.length).toBe(analyser.frequencyBinCount);
  });

  it("Uint8Arrayの長さはAnalyserNode.fftSize / 2と等しい", () => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    const result = getUint8ArrayFromAnalyser(analyser);

    expect(result.length).toBe(analyser.fftSize / 2);
  });
});

describe(getAudioBufferFromAudioFile, () => {
  it("AudioBufferを返す", async () => {
    const audioCtx = new AudioContext();
    const file = new File([audioArrayBuffer], "audio.mp3");

    const result = await getAudioBufferFromAudioFile({ file, audioCtx });

    expect(result).toBeInstanceOf(AudioBuffer);
  });

  it("txtファイルを読み込むとエラーが発生する", async () => {
    const audioCtx = new AudioContext();
    const file = new File([textArrayBuffer], "text.txt");

    await expect(getAudioBufferFromAudioFile({ file, audioCtx })).rejects.toThrow();
  });
});
