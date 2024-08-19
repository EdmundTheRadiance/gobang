import pieces from "../../modules/pieces";
import { NextPieceType, PieceType } from "../../typings/index";
import { Piece } from "../Piece";
import { OptimizationEvaluateFunction } from "./OptimizedEvaluateFunction";

export class MinMax extends OptimizationEvaluateFunction {
  getMove(): [row: number, col: number] {
    const pieceList = pieces.getPieces();
    const { moves = [[0, 0]] } = this.minimax(pieceList, 2, true, this.pieceType)
    const move = moves[~~(Math.random() * moves.length)]
    return move;
  }
  minimax(pieceList: (Piece | null)[][], depth: number, getMax: boolean, pieceType: PieceType) {
    if (depth <= 0) {
      return { score: this.evaluate(pieceList) };
    }
    const allMoves = this.getAllPossibleMove(pieceList);
    let bestScore = getMax ? -Infinity : Infinity;
    let bestMove: [row: number, col: number][] = [[0, 0]];
    for (const postion of allMoves) {
      pieceList[postion[0]][postion[1]] = new Piece(pieceType);
      const { score } = this.minimax(pieceList, depth - 1, !getMax, NextPieceType[pieceType]);
      if (getMax ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = [postion];
      } else if (score === bestScore) {
        bestMove.push(postion);
      }
      pieceList[postion[0]][postion[1]] = null;
    }
    return { score: bestScore, moves: bestMove };
  }
}
