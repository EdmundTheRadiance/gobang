import { PieceType } from "../typings/index";

export class Piece {
  private pieceType: PieceType;
  constructor(pieceType: PieceType) {
    this.pieceType = pieceType;
  }
  public getPieceType() {
    return this.pieceType;
  }
}