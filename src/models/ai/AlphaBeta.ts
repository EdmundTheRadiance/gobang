import pieces from "../../modules/pieces";
import { EvaluateResult, NextPieceType, PieceType } from "../../typings/index";
import { Piece } from "../Piece";
import { MinMax } from "./MinMax";

export class AlphaBeta extends MinMax {
  stopCompute = false;
  public pruneTime = 0;
  public evaluateTime = 0;
  getMove(): [row: number, col: number];
  getMove(): Promise<[row: number, col: number]>;
  getMove(): [row: number, col: number] | Promise<[row: number, col: number]> {
    const pieceList = pieces.getPieces();
    this.pruneTime = 0;
    this.evaluateTime = 0;
    return new Promise(async r => {
      const { moves = [[0, 0]] } = await this.alphaBeta(pieceList, 3, true, this.pieceType, -Infinity, Infinity);
      const move = moves[~~(Math.random() * moves.length)];
      console.log('pruneTime', this.pruneTime, this.evaluateTime)
      r(move);
    });
  }
  async alphaBeta(
    pieceList: (Piece | null)[][],
    depth: number,
    getMax: boolean,
    pieceType: PieceType,
    alpha: number,
    beta: number
  ): Promise<EvaluateResult> {
    if (depth <= 0) {
      this.evaluateTime++;
      return { score: this.evaluate(pieceList) };
    }
    const allMoves = this.getAllPossibleMove(pieceList);
    let bestScore = getMax ? -Infinity : Infinity;
    let bestMove: [row: number, col: number][] = [[0, 0]];
    for (const position of allMoves) {
      pieceList[position[0]][position[1]] = new Piece(pieceType);
      const { score } = await this.alphaBeta(pieceList, depth - 1, !getMax, NextPieceType[pieceType], alpha, beta);
      if (getMax ? score > beta : score < alpha) {
        pieceList[position[0]][position[1]] = null;
        this.pruneTime++;
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

      if (this.stopCompute) {
        console.log("🚀 ~ 到时间终止:", { score: bestScore, moves: bestMove }, depth)
        return { score: bestScore, moves: bestMove };
      }
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
