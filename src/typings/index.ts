export enum PieceType {
  WHITE = 1,
  BLACK = 2,
}

export enum GameState {
  PLAYING,
  END
}

export const NextPieceType = {
  [PieceType.WHITE]: PieceType.BLACK,
  [PieceType.BLACK]: PieceType.WHITE,
}

export enum EventName {
  'INTERFACE.CLICK',
  'CELL.CLICK',
  'WIN',
  'RESTART',
  'PIECES.ADD',
}

export const Directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

// 子相连时的分数，第一位表示多少子相连，第二位表示前后的对方子
export const PatternScore = {
  5: {
    0: Infinity,
    1: Infinity,
    2: Infinity,
  },
  4: {
    0: 10000,
    1: 1000,
    2: 100,
  },
  3: {
    0: 1000,
    1: 100,
    2: 10,
  },
  2: {
    0: 100,
    1: 10,
    2: 0,
  }
}