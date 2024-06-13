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
