export const getUint8ArrayFromAnalyser = (analyser: AnalyserNode) => {
  // 周波数データを取得
  const bufferLength = analyser.frequencyBinCount;

  // 周波数データを格納するための配列を作成
  const dataArray = new Uint8Array(bufferLength);

  // dataArrayに周波数データを格納
  analyser.getByteFrequencyData(dataArray);

  return dataArray;
};

export const getAudioBufferFromAudioFile = async ({
  file,
  audioCtx,
}: {
  file: File;
  audioCtx: AudioContext;
}) => {
  // ファイルをArrayBufferとして読み込む
  const arrayBuffer = await file.arrayBuffer();

  // ArrayBufferをデコードしてAudioBufferを生成
  return await audioCtx.decodeAudioData(arrayBuffer);
};
