export const VISUALIZER_SETTINGS = {
  CELL_WIDTH: 10,
  CELL_HEIT: 10,
  CELL_RADIUS: 2,
  CELL_SPACING: 3,
  MARGIN_LEFT: 31,
} as const;

export type AnalyserNodeFFTSize = 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;

export const ANALYSER_SETTINGS = {
  /**
   * これの半分の値が周波数データの数になる
   */
  FFT_SIZE: 128 satisfies AnalyserNodeFFTSize,
} as const;
