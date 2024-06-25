import { StringPatternScore } from "../../config";
import { Piece } from "../Piece";
import { EvaluateFunction } from "./EvaluateFunction";

const opStrMap = {
  '0': '1',
  '1': '0',
  '_': '_'
}

export class OptimizationEvaluateFunction extends EvaluateFunction {
  evaluate(pieceList: (Piece | null)[][]): number {
    let score = 0;
    const allPiecesString: string[] = [];
    // 所有行字符串
    for (let i = 0; i < pieceList.length; i++) {
      allPiecesString.push(pieceList[i].map((piece) => {
        return piece ? piece.getPieceType() === this.pieceType ? '1' : '0' : '_';
      }).join(''));
    }
    // 所有列字符串
    for (let i = 0; i < pieceList[0].length; i++) {
      const strs: string[] = [];
      for (let j = 0; j < pieceList.length; j++) {
        const piece = pieceList[j][i];
        strs.push(piece ? piece.getPieceType() === this.pieceType ? '1' : '0' : '_');
        if (piece?.getPieceType() === this.pieceType) {
          score += this.getPositionAdvance(pieceList, i , j);
        }
      }
      allPiecesString.push(strs.join(''));
    }
    // 所有斜线字符串
    for (let i = 0; i < pieceList[0].length; i++) {
      for (let dir of [[1, -1], [1, 1]]) {
        let j = 0;
        const strs: string[] = [];
        do {
          const piece = pieceList[dir[0] * j][i + dir[1] * j];
          strs.push(piece ? piece.getPieceType() === this.pieceType ? '1' : '0' : '_');
          j++;
        } while (i + dir[1] * j >= 0 && i + dir[1] * j < pieceList[0].length);
        allPiecesString.push(strs.join(''));
      }
    }
    for (let i = 1; i < pieceList.length; i++) {
      let strs1: string[] = [];
      let strs2: string[] = [];
      let j = 0;
      do {
        const piece1 = pieceList[i + j][j];
        strs1.push(piece1 ? piece1.getPieceType() === this.pieceType ? '1' : '0' : '_');
        const piece2 = pieceList[i + j][pieceList[0].length - 1 - j];
        strs2.push(piece2 ? piece2.getPieceType() === this.pieceType ? '1' : '0' : '_');
        j++;
      } while (i + j < pieceList.length);
      allPiecesString.push(strs1.join(''));
      allPiecesString.push(strs2.join(''));
    }
    const allOpPiecesString = allPiecesString.map(str => str.split('').map(s => opStrMap[s]).join(''));
    return score + this.getAllstrsScore(allPiecesString) - this.getAllstrsScore(allOpPiecesString);
  }
  getAllstrsScore(allPiecesString: string[]) {
    let score = 0;
    for (let i = 0; i < allPiecesString.length; i++) {
      let str = allPiecesString[i];
      for (let j = 0; j < StringPatternScore.length; j++) {
        const pattern = StringPatternScore[j].pattern;
        let index = str.indexOf(pattern);
        while (index > -1) {
          str = str.substring(0, index + StringPatternScore[j].remove[0])
                + str.substring(index + StringPatternScore[j].remove[1]);
          score += StringPatternScore[j].score;
          index = str.indexOf(pattern);
        }
      }
    }
    return score;
  }
}