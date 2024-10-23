import { Directions, MaxPositionAdvance, PatternScore, PositionAdvanceAttenuation } from "../../config";
import pieces from "../../modules/pieces";
import { NextPieceType, PieceType } from "../../typings/index";
import { AIBase } from "../AIBase";
import { Piece } from "../Piece";

export class EvaluateFunction extends AIBase {
  getMove() {
    const allPossibleMove = this.getAllPossibleMove();
    let maxScore = -Infinity;
    let bestMove: [row: number, col: number][] = [[0, 0]];
    const pieceList = pieces.getPieces();
    allPossibleMove.forEach(postion => {
      pieceList[postion[0]][postion[1]] = new Piece(this.pieceType);
      const score = this.evaluate(pieceList);
      if (score > maxScore) {
        maxScore = score;
        bestMove = [postion];
      } else if (score === maxScore) {
        bestMove.push(postion);
      }
      pieceList[postion[0]][postion[1]] = null;
    });
    return bestMove[~~(Math.random() * bestMove.length)];
  }
  evaluate(pieceList: (Piece | null)[][]): number {
    let score = 0;
    const postionCounted: [number, number][] = [];
    pieceList.forEach((row, rowNum) => {
      row.forEach((piece, colNum) => {
        // 计算位置分数
        if (piece?.getPieceType() === this.pieceType) {
          score += this.getPositionAdvance(pieceList, rowNum , colNum);
        }
        // 计算连续序列分数
        if (postionCounted.find(e => e[0] === rowNum && e[1] === colNum)) {
          return;
        }
        if (piece?.getPieceType() === this.pieceType) {
          score += this.computeOnePieceScore(
            piece,
            pieceList,
            rowNum,
            colNum,
            postionCounted,
            this.pieceType
          );
        } else if (piece?.getPieceType() === NextPieceType[this.pieceType]) {
          score -= this.computeOnePieceScore(
            piece,
            pieceList,
            rowNum,
            colNum,
            postionCounted,
            NextPieceType[this.pieceType]
          );
        }
      });
    });
    return score;
  }
  computeOnePieceScore(
    piece: Piece | null,
    pieceList: (Piece | null)[][],
    rowNum: number,
    colNum: number,
    postionCounted: [number, number][],
    pieceType: PieceType,
  ): number {
    let score = 0;
    Directions.forEach(direction => {
      let curPiece = piece;
      let i = 0;
      while (curPiece?.getPieceType() === pieceType) {
        postionCounted.push([rowNum + direction[0] * i, colNum + direction[1] * i]);
        i++;
        curPiece = pieceList[rowNum + direction[0] * i]?.[colNum + direction[1] * i];
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
      score += PatternScore[i]?.[blockNum] || 0;
    });
    return score;
  }
  getPositionAdvance(pieceList: (Piece | null)[][], row: number, col: number): number {
    const mid = pieceList.length / 2 - 0.5;
    const distance = Math.max(Math.abs(row - mid), Math.abs(col - mid));
    return MaxPositionAdvance * Math.pow(PositionAdvanceAttenuation, ~~distance);
  }
  getAllPossibleMove(list?: (Piece | null)[][]) {
    const pieceList = list || pieces.getPieces();
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