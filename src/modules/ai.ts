import { AIBase } from "../models/AIBase";
import { EvaluateFunction } from "../models/ai/EvaluateFunction";
import { EventName, GameState, NextPieceType, PieceType } from "../typings/index";
import event from "./event";
import pieces from "./pieces";
import gameState from "./gameState";

const aiPlayers: AIBase[] = [];

export default {
  init() {
    event.on(EventName["PIECES.ADD"], ([ , , pieceType]) => {
      aiPlayers.forEach(ai => {
        if (this.isAITurn(NextPieceType[pieceType])) {
          const position = ai.getMove();
          pieces.addPiece(NextPieceType[pieceType], ...position);
        }
      });
    });
  },
  createAIPlayer(pieceType: PieceType) {
    const ai = new EvaluateFunction(pieceType);
    aiPlayers.push(ai);
  },
  clearAIPlayers() {
    aiPlayers.splice(0, aiPlayers.length);
  },
  isAITurn(pieceType: PieceType) {
    return gameState.getState() === GameState.PLAYING && aiPlayers.findIndex(ai => ai.isAITurn(pieceType)) !== -1;
  }
}