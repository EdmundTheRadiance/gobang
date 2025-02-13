import { Piece } from "../Piece";
import { OptimizationEvaluateFunction } from "./OptimizedEvaluateFunction";
import { NextPieceType, PieceType } from "../../typings/index";
import pieces from "../../modules/pieces";

interface Node {
  board: (Piece | null)[][];
  player: PieceType;
  parent: Node | null;
  children: Node[];
  wins: number;
  visits: number;
  untriedMoves: [number, number][];
}

const MaxIterationTimes = 1000;

export class MonteCarloTreeSearch extends OptimizationEvaluateFunction {
  getMove(): [number, number] {
    const pieceList = pieces.getPieces();
    const root: Node = {
      board: pieceList,
      player: this.pieceType,
      parent: null,
      children: [],
      wins: 0,
      visits: 0,
      untriedMoves: this.getAllPossibleMove(pieceList)
    }
    for (let i = 0; i < MaxIterationTimes; i++) {
      let node = this.select(root);
      if (node.untriedMoves.length > 0) {
        node = this.expand(node);
      }
      const winner = this.simulate(node);
      this.backpropagate(node, winner);
    }

    return this.getBestMove(root);
  }
  select(node: Node): Node {
    while (node.untriedMoves.length === 0 && node.children.length > 0) {
      node = this.uctSelect(node);
    }
    return node;
  }

  uctSelect(node: Node): Node {
    let bestChild: Node | null = null;
    let bestValue = -Infinity;

    for (const child of node.children) {
      const uctValue = child.wins / child.visits + Math.sqrt(2 * Math.log(node.visits) / child.visits);
      if (uctValue > bestValue) {
        bestValue = uctValue;
        bestChild = child;
      }
    }

    return bestChild!;
  }
  expand(node: Node): Node {
    const move = node.untriedMoves.pop()!;
    const newBoard = this.makeMove(node.board, move, node.player);
    const newNode = {
      board: newBoard,
      player: NextPieceType[node.player],
      parent: node,
      children: [],
      wins: 0,
      visits: 0,
      untriedMoves: this.getAllPossibleMove(newBoard)
    }
    node.children.push(newNode);
    return newNode;
  }
  
  makeMove(board: (Piece | null)[][], move: [number, number], player: PieceType): (Piece | null)[][] {
    const newBoard = board.map(row => row.slice());
    newBoard[move[0]][move[1]] = new Piece(player);
    return newBoard;
  }

  simulate(node: Node): PieceType | null {
    let currentBoard = node.board;
    let currentPlayer = node.player;

    while (true) {
      const availableMoves = this.getAllPossibleMove(currentBoard);
      if (availableMoves.length === 0) {
        return null; // 平局
      }

      const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      currentBoard = this.makeMove(currentBoard, move, currentPlayer);

      if (this.checkWin(currentBoard, currentPlayer)) {
        return currentPlayer;
      }

      currentPlayer = NextPieceType[currentPlayer];
    }
  }
  
  checkWin(board: (Piece | null)[][], player: PieceType): boolean {
    // 检查是否有五连珠
    const directions = [
      [1, 0], [0, 1], [1, 1], [1, -1]
    ];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col]?.getPieceType() === player) {
          for (const [dRow, dCol] of directions) {
            if (this.countConsecutive(board, row, col, dRow, dCol, player) >= 5) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  countConsecutive(board: (Piece | null)[][], row: number, col: number, dRow: number, dCol: number, player: PieceType): number {
    let count = 0;
    for (let i = 0; i < 5; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && board[newRow][newCol]?.getPieceType() === player) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
  backpropagate(node: Node, winner: PieceType | null): void {
    let tempNode: Node | null = node;
    while (tempNode !== null) {
      tempNode.visits++;
      if (winner !== null && tempNode.player === winner) {
        tempNode.wins++;
      }
      tempNode = tempNode.parent;
    }
  }
  
  getBestMove(root: Node): [number, number] {
    let bestChild: Node | null = null;
    let bestVisits = -1;

    for (const child of root.children) {
      if (child.visits > bestVisits) {
        bestVisits = child.visits;
        bestChild = child;
      }
    }

    let bestMove: [number, number] = [0, 0];
    bestChild!.board.forEach((row, rowIndex) => {
      row.findIndex((cell, colIndex) => {
        if (cell && !root.board[rowIndex][colIndex]) {
          bestMove = [rowIndex, colIndex];
        }
      })
    });
    return bestMove;
  }
}