import { AIBase } from "../models/AIBase";
import { EventName, GameState, NextPieceType, PieceType } from "../typings/index";
import event from "./event";
import pieces from "./pieces";
import gameState from "./gameState";
import { EvaluateFunction } from "../models/ai/EvaluateFunction";
import { OptimizationEvaluateFunction } from "../models/ai/OptimizedEvaluateFunction";
import { MinMax } from "../models/ai/MinMax";
import { AlphaBeta } from "../models/ai/AlphaBeta";
import { IterativeDeepeningSearch } from "../models/ai/IterativeDeepeningSearch";
import { HeuristicFunction } from "../models/ai/HeuristicFunction";
import { MonteCarloTreeSearch } from "../models/ai/MonteCarloTreeSearch";
import { ZobristHash } from "../models/ai/ZobristHash/ZobristHash";

const aiPlayers: AIBase[] = [];
const aiScripts = {
  EvaluateFunction,
  OptimizationEvaluateFunction,
  MinMax,
  AlphaBeta,
  IterativeDeepeningSearch,
  HeuristicFunction,
  MonteCarloTreeSearch,
  ZobristHash,
}

const TimeCostMap = {
  [PieceType.WHITE]: {
    costTiem: 0,
    pruneTime: 0,
    evaluateTime: 0,
    cacheTime: 0,
  },
  [PieceType.BLACK]: {
    costTiem: 0,
    pruneTime: 0,
    evaluateTime: 0,
    cacheTime: 0,
  },
}

export default {
  init() {
    event.on(EventName["PIECES.ADD"], ([ , , pieceType]) => {
      this.aiMove(NextPieceType[pieceType]);
    });
    event.on(EventName["RESTART"], () => {
      this.aiMove(PieceType.WHITE);
    });
    event.on(EventName["EVALUATION.END"], () => {
      console.log("🚀 ~ TimeCostMap:", TimeCostMap)
    });
    this.aiMove(PieceType.WHITE);
  },
  createAIPlayer(pieceType: PieceType, script: string) {
    const ai = new aiScripts[script](pieceType);
    aiPlayers.push(ai);
  },
  aiMove(pieceType: PieceType) {
    aiPlayers.forEach(async ai => {
      if (gameState.getState() === GameState.PLAYING && ai.isAITurn(pieceType)) {
        const now = Date.now();
        const position = await ai.getMove();
        const timeCost = Date.now() - now;
        TimeCostMap[pieceType].costTiem += timeCost;
        TimeCostMap[pieceType].pruneTime += (ai as any).pruneTime || 0;
        TimeCostMap[pieceType].evaluateTime += (ai as any).evaluateTime || 0;
        TimeCostMap[pieceType].cacheTime += (ai as any).cacheTime || 0;
        // console.log(timeCost);
        // setTimeout(() => {
        pieces.addPiece(pieceType, position[0], position[1]);
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