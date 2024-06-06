import pieces from "../../modules/pieces";
import { Directions, PatternScore } from "../../typings/index";
import { AIBase } from "../AIBase";
import { Piece } from "../Piece";

export class EvaluateFunction extends AIBase {
  getMove(): [row: number, col: number] {
    const allPossibleMove = this.getAllPossibleMove();
    let maxScore = -Infinity;
    let bestMove: [row: number, col: number] = [0, 0];
    const pieceList = pieces.getPieces();
    allPossibleMove.forEach(postion => {
      pieceList[postion[0]][postion[1]] = new Piece(this.pieceType);
      const score = this.evaluate(pieceList);
      if (score > maxScore) {
        maxScore = score;
        bestMove = postion;
      }
      pieceList[postion[0]][postion[1]] = null;
    });
    return bestMove;
  }
  evaluate(pieceList: (Piece | null)[][]): number {
    let score = 0;
    const postionCounted: [number, number][] = [];
    pieceList.forEach((row, rowNum) => {
      row.forEach((piece, colNum) => {
        if (piece?.getPieceType() === this.pieceType) {
          if (postionCounted.find(e => e[0] === rowNum && e[1] === colNum)) {
            return;
          }
          Directions.forEach(direction => {
            let curPiece: Piece | null = piece;
            let i = 1;
            while (curPiece?.getPieceType() === this.pieceType) {
              curPiece = pieceList[rowNum + direction[0] * i]?.[colNum + direction[1] * i];
              postionCounted.push([rowNum + direction[0] * i, colNum + direction[1] * i]);
              i++;
            }
            let blockNum = 0; // 在两边阻挡的棋子数
            if (curPiece !== null) {
              // 当前棋子序列末尾的下一个格子不为空位
              blockNum++;
            }
            if (pieceList[rowNum - direction[0]]?.[colNum - direction[1]] !== null) {
              // 当前棋子序列的上一个格子不为空位
              blockNum++;
            }
            score += PatternScore[i - 1]?.[blockNum] || 0;
          });
        }
      });
    });
    return score;
  }
  getAllPossibleMove() {
    const pieceList = pieces.getPieces();
    const allPossibleMove: [number, number][] = [];
    pieceList.forEach((row, rowNum) => {
      row.forEach((piece, colNum) => {
        if (!piece) {
          allPossibleMove.push([rowNum, colNum]);
        }
      });
    });
    return allPossibleMove;
  }
}