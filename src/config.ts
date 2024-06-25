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

// 子相连时的分数，1为我方棋子，0为棋牌边界或对方棋子，_为空格
// remove表示移除的开始和结束位置
export const StringPatternScore = [
  {
    pattern: '11111',
    score: Infinity,
    remove: [0, 5]
  },
  {
    pattern: '_1111_',
    score: 10000,
    remove: [1, 5]
  },
  {
    pattern: '011110',
    score: 100,
    remove: [1, 5]
  },
  {
    pattern: '1111',
    score: 1000,
    remove: [0, 4]
  },
  {
    pattern: '_111_',
    score: 1000,
    remove: [1, 4]
  },
  {
    pattern: '01110',
    score: 10,
    remove: [1, 4]
  },
  {
    pattern: '111',
    score: 100,
    remove: [0, 3]
  },
  {
    pattern: '_11_11_',
    score: 1000,
    remove: [1, 6]
  },
  {
    pattern: '011_110',
    score: 100,
    remove: [1, 6]
  },
  {
    pattern: '11_11',
    score: 500,
    remove: [0, 5]
  },
  {
    pattern: '_11_1_',
    score: 1000,
    remove: [1, 5]
  },
  {
    pattern: '011_10',
    score: 10,
    remove: [1, 5]
  },
  {
    pattern: '01_110',
    score: 10,
    remove: [1, 5]
  },
  {
    pattern: '11_1',
    score: 100,
    remove: [0, 4]
  },
  {
    pattern: '1_11',
    score: 100,
    remove: [0, 4]
  },
  {
    pattern: '_11_',
    score: 100,
    remove: [1, 3]
  },
  {
    pattern: '0110',
    score: 0,
    remove: [1, 3]
  },
  {
    pattern: '11',
    score: 10,
    remove: [0, 2]
  }
]