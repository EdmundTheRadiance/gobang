import { COLUMN_NUM, ROW_NUM } from "../config";
import { Piece } from "../models/Piece";
import { deepCloneObject } from "./utils";
import { EventName, NextPieceType, PieceType } from "../typings/index";
import event from "./event";

const rows = ROW_NUM;
const cols = COLUMN_NUM;
const pieces: (Piece|null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
let curPieceType: PieceType = PieceType.WHITE;

export default {
  init() {
    curPieceType = PieceType.WHITE;
    event.on(EventName["CELL.CLICK"], ([ row, col ]: number[]) => {
      if (!pieces[row][col]) {
        this.addPiece(curPieceType, row, col);
      }
    });

    event.on(EventName["RESTART"], () => {
      pieces.forEach(row => {
        row.splice(0, row.length, ...Array(row.length).fill(null))
      });
      curPieceType = PieceType.WHITE;
    });
  },
  getPieces() {
    return pieces.map(e => e.map(piece => {
      if (piece === null) {
        return null;
      }
      return deepCloneObject(piece);
    }));
  },
  addPiece(pieceType: PieceType, row: number, col: number) {
    if (pieces[row][col] === null) {
      pieces[row][col] = new Piece(pieceType);
      if (this.checkWin(curPieceType, row, col)) {
        event.trigger(EventName["WIN"], curPieceType);
        return;
      }
      curPieceType = NextPieceType[curPieceType];
      event.trigger(EventName["PIECES.ADD"], [row, col, pieceType]);
      return pieces[row][col];
    } else {
      return null;
    }
  },
  checkWin(pieceType: PieceType, row: number, col: number) {
    const directions = [
      [[-1, 0], [1, 0]],  // 水平方向
      [[0, -1], [0, 1]],  // 垂直方向
      [[-1, -1], [1, 1]],  // 主对角线方向
      [[-1, 1], [1, -1]]  // 副对角线方向
    ];

    for (let i = 0; i < directions.length; i++) {
      let count = 1;  // 计数器，开始时计为1，因为包括了刚下的这个棋子
      for (let j = 0; j < directions[i].length; j++) {
        const dir = directions[i][j];
        let x = row + dir[0];
        let y = col + dir[1];
        while (
          x >= 0
          && x < pieces.length
          && y >= 0
          && y < pieces[0].length
          && pieces[x][y]?.getPieceType() === pieceType
        ) {
          count++;
          x += dir[0];
          y += dir[1];
        }
      }
      if (count >= 5) {
        return true;
      }
    }
    return false;
  }
}