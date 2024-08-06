import { Directions, StringPatternScore } from "../../config";
import { Piece } from "../Piece";
import { EvaluateFunction } from "./EvaluateFunction";
import pieces from "../../modules/pieces";

const opStrMap = {
  '0': '1',
  '1': '0',
  '_': '_'
}

export class OptimizationEvaluateFunction extends EvaluateFunction {
  evaluate(pieceList: (Piece | null)[][]): number {
    let score = 0;
    const rowNum = pieceList.length;
    const colNum = pieceList[0].length;
    const cellChars: string[][] = Array.from({length: (rowNum + colNum) * 3 - 2}, () => []);
    const mid = (rowNum + colNum) / 2 - 1;
    for (let i = 0; i < pieceList.length; i++) {
      for (let j = 0; j < pieceList.length; j++) {
        const piece = pieceList[i][j];
        const char = piece ? piece.getPieceType() === this.pieceType ? '1' : '0' : '_';
        cellChars[i][j] = char;
        cellChars[j + rowNum][i] = char;
        cellChars[(j - i + mid) + rowNum + colNum][Math.min(i ,j)] = char;
        cellChars[(j + i) + (rowNum + colNum) * 2 - 1].push(char);
        // 计算位置分数
        if (piece?.getPieceType() === this.pieceType) {
          score += this.getPositionAdvance(pieceList, i, j);
        }
      }
    }
    const allPiecesString: string[] = cellChars.map(e => e.join(''));
    const allOpPiecesString = cellChars.map(e => e.map(s => opStrMap[s]).join(''));
    return score + this.getAllstrsScore(allPiecesString) - this.getAllstrsScore(allOpPiecesString);
  }
  getAllstrsScore(allPiecesString: string[]) {
    let score = 0;
    for (let i = 0; i < allPiecesString.length; i++) {
      let str = `0${allPiecesString[i]}0`;
      if (!str.includes('1')) {
        continue;
      }
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
  getAllPossibleMove(list?: (Piece | null)[][]): [number, number][] {
    const pieceList = list || pieces.getPieces();
    const allPossibleMove: [number, number][] = [];
    let hasPiece = false;
    pieceList.forEach((row, rowNum) => {
      row.forEach((piece, colNum) => {
        if (!piece) {
          for (let i = 0; i < Directions.length; i++) {
            const direction = Directions[i];
            // 当前空位贴着其他棋子，才会评估
            if (pieceList[rowNum + direction[0]]?.[colNum + direction[1]]) {
              allPossibleMove.push([rowNum, colNum]);
              break;
            }
          }
        } else {
          hasPiece = true;
        }
      });
    });
    if (!hasPiece) {
      const mid = ~~(pieceList.length / 2 - 0.5)
      return [[mid, mid]];
    }
    return allPossibleMove;
  }
}
