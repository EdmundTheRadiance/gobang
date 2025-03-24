import pieces from "../../../modules/pieces";
import { EvaluateResult, NextPieceType, PieceType } from "../../../typings/index";
import { Piece } from "../../Piece";
import { AlphaBeta } from "../AlphaBeta";
import { zobristTable } from "./randomMap";
import { record } from "./record";

export class ZobristHash extends AlphaBeta {
  private curStep: number = 0;
  private cacheTime: number = 0;
  constructor(pieceType: PieceType) {
    super(pieceType);
    this.curStep = 0;
    this.cacheTime = 0;
  };
  computeInitialHash(pieceList: (Piece | null)[][]): number {
    !(window as any).transpositionTable && ((window as any).transpositionTable = new Map());
    let hash = 0;
    for (let i = 0; i < pieceList.length; i++) {
      for (let j = 0; j < pieceList[0].length; j++) {
        const piece = pieceList[i][j];
        if (piece !== null) {
          hash ^= zobristTable[i][j][piece.getPieceType()];
        }
      }
    }
    return hash;
  }

  updateHash(hash: number, x: number, y: number, oldPiece: Piece | null, newPiece: Piece | null): number {
    if (oldPiece !== null) {
      hash ^= zobristTable[x][y][oldPiece.getPieceType()];
    }
    if (newPiece !== null) {
      hash ^= zobristTable[x][y][newPiece.getPieceType()];
    }
    return hash;
  }

  storeInTranspositionTable(hash: number, value: number, depth: number, position: [number, number]) {
    (window as any).transpositionTable.set(hash, { value, depth, position });
  }

  lookupInTranspositionTable(hash: number, depth: number): { value: number, position: [number, number] } | undefined {
    const entry = (window as any).transpositionTable.get(hash);
    if (entry && entry.depth >= depth) {
      return entry;
    }
    return undefined;
  }
  
  getMove(): [row: number, col: number];
  getMove(): Promise<[row: number, col: number]>;
  getMove(): [row: number, col: number] | Promise<[row: number, col: number]> {
    const pieceList = pieces.getPieces();
    this.pruneTime = 0;
    this.evaluateTime = 0;
    this.curStep += 2;
    return new Promise(async r => {
      let hash = this.computeInitialHash(pieceList);
      if (record[hash]) {
        r(record[hash]);
      }
      const { moves = [[0, 0]] } = await this.zobristHash(pieceList, 2, true, this.pieceType, -Infinity, Infinity, hash);
      const move = moves[~~(Math.random() * moves.length)];
      console.log('pruneTime', this.pruneTime, this.evaluateTime, this.cacheTime);
      r(move);
    });
  }
  async zobristHash(
    pieceList: (Piece | null)[][],
    depth: number,
    getMax: boolean,
    pieceType: PieceType,
    alpha: number,
    beta: number,
    hash: number
  ): Promise<EvaluateResult> {
    // if (record[hash] && this.curStep < 10) {
    //   console.log('use record');
    //   return { score: Infinity , moves: [record[hash]] };
    // }
    const cache = this.lookupInTranspositionTable(hash, depth);
    if (cache !== undefined) {
      this.cacheTime++;
      return {
        score: cache.value,
        moves: [cache.position]
      }
    }
    if (depth <= 0) {
      this.evaluateTime++;
      return { score: this.evaluate(pieceList) };
    }
    const allMoves = this.getAllPossibleMove(pieceList);
    let bestScore = getMax ? -Infinity : Infinity;
    let bestMove: [row: number, col: number][] = [[0, 0]];
    for (const position of allMoves) {
      pieceList[position[0]][position[1]] = new Piece(pieceType);
      const newHash = this.updateHash(hash, position[0], position[1], null, pieceList[position[0]][position[1]]);
      const { score } = await this.zobristHash(pieceList, depth - 1, !getMax, NextPieceType[pieceType], alpha, beta, newHash);
      if (getMax ? score > beta : score < alpha) {
        pieceList[position[0]][position[1]] = null;
        this.pruneTime++;
        this.storeInTranspositionTable(hash, score, depth, [position[0], position[1]]);
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
}