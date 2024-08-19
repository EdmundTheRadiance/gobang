import pieces from "../../modules/pieces";
import { NextPieceType, PieceType } from "../../typings/index";
import { Piece } from "../Piece";
import { MinMax } from "./MinMax";

export class AlphaBeta extends MinMax {
  getMove(): [row: number, col: number] {
    const pieceList = pieces.getPieces();
    const { moves = [[0, 0]] } = this.alphaBeta(pieceList, 2, true, this.pieceType, -Infinity, Infinity);
    const move = moves[~~(Math.random() * moves.length)]
    return move;
  }
  alphaBeta(pieceList: (Piece | null)[][], depth: number, getMax: boolean, pieceType: PieceType, alpha: number, beta: number) {
    if (depth <= 0) {
      return { score: this.evaluate(pieceList) };
    }
    const allMoves = this.getAllPossibleMove(pieceList);
    let bestScore = getMax ? -Infinity : Infinity;
    let bestMove: [row: number, col: number][] = [[0, 0]];
    for (const position of allMoves) {
      pieceList[position[0]][position[1]] = new Piece(pieceType);
      const { score } = this.alphaBeta(pieceList, depth - 1, !getMax, NextPieceType[pieceType], alpha, beta);
      if (getMax ? score > beta : score < alpha) {
        pieceList[position[0]][position[1]] = null;
        return { score };
      }
      if (getMax ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = [position];
        getMax ? (alpha = bestScore) : (beta = bestScore);
      } else if (score === bestScore) {
        bestMove.push(position);
      }
      pieceList[position[0]][position[1]] = null;
    }
    return { score: bestScore, moves: bestMove };
  }
  showPiece(pieceList: (Piece | null)[][]) {
    const t: string[][] = [];
    pieceList.forEach((row) => {
      t.push(row.map((piece) => piece ? piece.getPieceType() === PieceType.WHITE ? '1' : '0' : ''))
    });
    return t;
  }
}
