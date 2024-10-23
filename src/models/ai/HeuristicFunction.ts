import { Piece } from "../Piece";
import { OptimizationEvaluateFunction } from "./OptimizedEvaluateFunction";
import { NextPieceType, PieceType } from "../../typings/index";

export class HeuristicFunction extends OptimizationEvaluateFunction {
  evaluate(pieceList: (Piece | null)[][], curPieceType?: PieceType, score: number = 0): number {
    if (!curPieceType) {
      curPieceType = NextPieceType[this.pieceType];
    }

    const ref = {
      maxLength: 0, // 我方最大长度
      bestPosition: [] as [number, number][], // 最优落子位置
      maxOppositeLength: 0, // 对方最大长度
      oppositeBestPosition: [] as [number, number][], // 对方最优落子位置
      length: 0, // 当前的序列长度
      oppositeLength: 0, // 当前对方的序列长度
    }
    const n = pieceList.length;
    const m = pieceList[0].length;

    function setBestPosition(isOpposite: boolean, pos: [number, number], dir: [number, number], length: number) {
      if (pieceList[pos[0]][pos[1]] === null) {
        (isOpposite ? ref.bestPosition : ref.oppositeBestPosition).push([pos[0], pos[1]]);
      }
      const startPos = [pos[0] - (length + 1) * dir[0], pos[1] - (length + 1) * dir[1]];
      if (pieceList[startPos[0]][startPos[1]] === null) {
        (isOpposite ? ref.bestPosition : ref.oppositeBestPosition).push([startPos[0], startPos[1]]);
      }
    }

    function setMax(isOpposite: boolean, pos: [number, number], dir: [number, number]): void {
      if (isOpposite) {
        if (ref.length > 0) {
          if (ref.maxLength === ref.length) {
            setBestPosition(isOpposite, pos, dir, ref.length);
          } else if (ref.maxLength < ref.length) {
            ref.maxLength = ref.length;
            ref.bestPosition = [];
            setBestPosition(isOpposite, pos, dir, ref.length);
          }
          ref.length = 0;
        }
      } else {
        if (ref.oppositeLength > 0) {
          if (ref.maxOppositeLength === ref.oppositeLength) {
            setBestPosition(isOpposite, pos, dir, ref.oppositeLength);
          } else if (ref.maxOppositeLength < ref.oppositeLength) {
            ref.maxOppositeLength = ref.oppositeLength;
            ref.oppositeBestPosition = [];
            setBestPosition(isOpposite, pos, dir, ref.oppositeLength);
          }
          ref.oppositeLength = 0;
        }
      }
    }

    function getMaxLength(piece: Piece | null, pieceType: PieceType, pos: [number, number], dir: [number, number]) {
      if (!piece) {
        setMax(true, pos, dir);
        setMax(false, pos, dir);
      } else if (piece.getPieceType() === pieceType) {
        ref.length++;
        setMax(false, pos, dir);
      } else if (piece.getPieceType() === NextPieceType[pieceType]) {
        ref.oppositeLength++;
        setMax(true, pos, dir);
      }
    }

    // 检查行
    for (let i = 0; i < n; i++) {
      ref.length = 0;
      ref.oppositeLength = 0;
      for (let j = 0; j < m; j++) {
        const piece = pieceList[i][j];
        getMaxLength(piece, curPieceType, [i, j], [0, 1]);
      }
    }

    // 检查列
    for (let j = 0; j < m; j++) {
      ref.length = 0;
      ref.oppositeLength = 0;
      for (let i = 0; i < n; i++) {
        const piece = pieceList[i][j];
        getMaxLength(piece, curPieceType, [i, j], [1, 0]);
      }
    }

    // 从左上到右下的对角线
    for (let k = 0; k <= n + m - 2; k++) {
      for (let j = 0; j <= k; j++) {
        const i = k - j;
        if (i < n && j < m) {
          const piece = pieceList[i][j];
          getMaxLength(piece, curPieceType, [i, j], [-1, 1]);
        }
      }
    }

    // 从左下到右上的对角线
    for (let k = 1 - n; k < m; k++) {
      for (let j = 0; j < n; j++) {
        const i = j + k;
        if (i >= 0 && i < m) {
          const piece = pieceList[i][j];
          getMaxLength(piece, curPieceType, [i, j], [1, 1]);
        }
      }
    }

    console.log("🚀 ~ HeuristicFunction ~ :", ref.maxOppositeLength, ref.maxLength)
    if (ref.maxOppositeLength > ref.maxLength) {
      if (ref.maxOppositeLength >= 5) {
        return -1;
      }
      for (let i = 0; i < ref.oppositeBestPosition.length; i++) {
        const pos = ref.oppositeBestPosition[i];
        pieceList[pos[0]][pos[1]] = new Piece(curPieceType);
        score += this.evaluate(pieceList, NextPieceType[curPieceType], score);
        pieceList[pos[0]][pos[1]] = null;
      }
    } else {
      if (ref.maxLength >= 5) {
        return 1;
      }
      for (let i = 0; i < ref.bestPosition.length; i++) {
        const pos = ref.bestPosition[i];
        pieceList[pos[0]][pos[1]] = new Piece(curPieceType);
        score += this.evaluate(pieceList, NextPieceType[curPieceType], score);
        pieceList[pos[0]][pos[1]] = null;
      }
    }

    return score;
  }
}
