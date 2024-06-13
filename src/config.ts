export const ROW_NUM = 15;
export const COLUMN_NUM = 15;

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

// 位置优势衰减越靠近中心的棋子优势越大
export const PositionAdvanceAttenuation = 0.8;
export const MaxPositionAdvance = 20;

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
  }
}