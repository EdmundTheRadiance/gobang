import { PieceType } from "../typings/index";

export class AIBase {
  protected pieceType: PieceType;
  constructor(pieceType: PieceType) {
    this.pieceType = pieceType;
  }
  isAITurn(pieceType: PieceType): boolean {
    return this.pieceType === pieceType;
  }
  getMove(): [row: number, col: number] {
    return [0, 0];
  }
}