export type State = {
  // 背景グリッド線関連のState
  lines: {
    x: number;
    y: number;
  };

  // ステッカー関連のState
  images: {
    image: HTMLImageElement;
    x: number;
    y: number;
    scale: number;
    opacity: number;
  }[];

  // メインステッカー下のテキスト関連のState
  textUnderMainLogo: {
    opacity: number;
  };
};

export const state: State = {
  lines: {
    x: 0,
    y: 0,
  },
  images: [],
  textUnderMainLogo: {
    opacity: 0,
  },
};
