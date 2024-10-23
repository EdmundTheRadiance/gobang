import pieces from "../../modules/pieces";
import { EvaluateResult, PieceType } from "../../typings";
import { Piece } from "../Piece";
import { AlphaBeta } from "./AlphaBeta";

const maxIterativeDepth = 3;
const timeLimit = 5000000;

export class IterativeDeepeningSearch extends AlphaBeta {
  bestMove: [row: number, col: number][] = [];
  getMove(): [row: number, col: number];
  getMove(): Promise<[row: number, col: number]>;
  getMove(): [row: number, col: number] | Promise<[row: number, col: number]> {
    this.stopCompute = false;
    this.bestMove = [];
    this.pruneTime = 0;
    this.evaluateTime = 0;
    let i = 1;
    const timeout = setTimeout(() => {
      this.stopCompute = true;
      console.log("🚀 ~ IterativeDeepeningSearch ~ timeout ~ this.stopCompute:", i)
    }, timeLimit);
    return new Promise(async r => {
      const pieceList = pieces.getPieces();
      for (; i <= maxIterativeDepth; i++) {
        const rst = await this.alphaBeta(pieceList, i, true, this.pieceType, -Infinity, Infinity);
        this.bestMove = rst.moves || [];
      }
      const move = this.bestMove[~~(Math.random() * this.bestMove.length)]
      clearTimeout(timeout);
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
    const rst = await new Promise(resolve => {
      setTimeout(async () => {
        const r = await super.alphaBeta(pieceList, depth, getMax, pieceType, alpha, beta);
        resolve(r);
      }, 0);
    });
    return rst as EvaluateResult;
  }
  getAllPossibleMove(list?: (Piece | null)[][]): [number, number][] {
    const allPossibleMove = super.getAllPossibleMove(list);
    if (this.bestMove.length) {
      allPossibleMove.sort((a, b) => {
        if (this.bestMove.find(e => a[0] === e[0] && a[1] === e[1])) return -1;
        if (this.bestMove.find(e => b[0] === e[0] && b[1] === e[1])) return 1;
        return 0;
      });
    }
    return allPossibleMove;
  }
}