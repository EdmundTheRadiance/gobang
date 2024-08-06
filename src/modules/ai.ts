import { AIBase } from "../models/AIBase";
import { EventName, GameState, NextPieceType, PieceType } from "../typings/index";
import event from "./event";
import pieces from "./pieces";
import gameState from "./gameState";
import { EvaluateFunction } from "../models/ai/EvaluateFunction";
import { OptimizationEvaluateFunction } from "../models/ai/OptimizedEvaluateFunction";
import { MinMax } from "../models/ai/MinMax";

const aiPlayers: AIBase[] = [];
const aiScripts = {
  EvaluateFunction,
  OptimizationEvaluateFunction,
  MinMax
}

export default {
  init() {
    event.on(EventName["PIECES.ADD"], ([ , , pieceType]) => {
      this.aiMove(NextPieceType[pieceType]);
    });
    event.on(EventName["RESTART"], () => {
      this.aiMove(PieceType.WHITE);
    });
    this.aiMove(PieceType.WHITE);
  },
  createAIPlayer(pieceType: PieceType, script: string) {
    const ai = new aiScripts[script](pieceType);
    aiPlayers.push(ai);
  },
  aiMove(pieceType: PieceType) {
    aiPlayers.forEach(ai => {
      if (gameState.getState() === GameState.PLAYING && ai.isAITurn(pieceType)) {
        const now = Date.now();
        const position = ai.getMove();
        console.log(Date.now() - now);
        // setTimeout(() => {
        pieces.addPiece(pieceType, ...position);
        // }, 2000);
      }
    });
  },
  clearAIPlayers() {
    aiPlayers.splice(0, aiPlayers.length);
  },
  isAITurn(pieceType: PieceType) {
    return gameState.getState() === GameState.PLAYING && aiPlayers.findIndex(ai => ai.isAITurn(pieceType)) !== -1;
  }
}