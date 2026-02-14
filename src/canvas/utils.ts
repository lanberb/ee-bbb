/**
 * @summary (与えられた幅 - (行数 - 1) * グリッドの幅)を引いた値を2で割る
 * @param width 描画する領域幅
 * @param lineCount グリッドの本数
 * @param dist ドラッグなどによる描画位置のズレ量
 */
export const caluculateFirstLineStart = (width: number, lineCount: number, gap: number, dist: number) => {
  return (width - (lineCount - 1) * gap) / 2 + dist;
};

/**
 * @summary グリッド線の開始位置を配列で返す
 */
export const caluculateLineStartArray = (startPosition: number, lineCount: number, gap: number) => {
  return Array.from({ length: lineCount }, (_, i) => {
    return startPosition + i * gap;
  });
};
