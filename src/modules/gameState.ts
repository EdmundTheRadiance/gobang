import { EventName, PieceType, GameState } from "../typings/index";
import ai from "./ai";
import event from "./event";

let currentState: GameState = GameState.END;
const enterStateFuncMap: { [key in GameState] ? : () => void } = {};
const exitStateFuncMap: { [key in GameState] ? : () => void } = {};
let autoPlayGameNum = 10;
const result = {
  [PieceType.WHITE]: 0,
  [PieceType.BLACK]: 0,
}
let drawTimeout = 0; // 和棋处理

const isValidTransition = function(toState: GameState): boolean {
  switch (currentState) {
    case GameState.PLAYING:
      return toState === GameState.END;
    case GameState.END:
      return toState === GameState.PLAYING;
    default:
      return false;
  }
}

enterStateFuncMap[GameState.END] = () => {
  ai.clearAIPlayers();
}
enterStateFuncMap[GameState.PLAYING] = () => {
  setTimeout(() => {
  // ai.createAIPlayer(PieceType.BLACK, 'EvaluateFunction');
  // ai.createAIPlayer(PieceType.BLACK, 'OptimizationEvaluateFunction');
  // ai.createAIPlayer(PieceType.BLACK, 'MinMax');
  // ai.createAIPlayer(PieceType.WHITE, 'AlphaBeta');
  // ai.createAIPlayer(PieceType.BLACK, 'IterativeDeepeningSearch');
  // ai.createAIPlayer(PieceType.BLACK, 'HeuristicFunction');
  ai.createAIPlayer(PieceType.BLACK, 'MonteCarloTreeSearch');
  ai.aiMove(PieceType.WHITE);
  }, 1000);
}

const mod = {
  GameState,
  init() {
    mod.transitionTo(GameState.PLAYING);
    // event.on(EventName["WIN"], (pieceType: PieceType) => {
    event.on(EventName["WIN"], () => {
      mod.transitionTo(GameState.END);
      // mod.autoPlay(pieceType);
    });
    event.on(EventName["RESTART"], () => {
      mod.transitionTo(GameState.PLAYING);
    });
  },
  transitionTo(toState: GameState): void {
    if (isValidTransition(toState)) {
      exitStateFuncMap[currentState]?.();
      currentState = toState;
      enterStateFuncMap[toState]?.();
      console.log(`状态已变更为 ${toState}`);
    } else {
      console.log(`无效的状态转换: ${currentState} -> ${toState}`);
    }
  },
  getState() {
    return currentState;
  },
  autoPlay(pieceType: PieceType) {
    if (drawTimeout) {
      clearTimeout(drawTimeout);
      drawTimeout = 0;
    }
    // drawTimeout = setTimeout(() => {
    //   mod.transitionTo(GameState.END);
    //   // 10s后还没决出胜负，可能是和棋，直接重开
    //   event.trigger(EventName["RESTART"]);
    //   console.log("🚀 ~ event.on ~ result:", result)
    // }, 10 * 1000);
    result[pieceType]++;
    autoPlayGameNum--;
    if (autoPlayGameNum > 0) {
      console.log("🚀 ~ event.on ~ result:", result)
      event.trigger(EventName["EVALUATION.END"]);
      setTimeout(() => {
        event.trigger(EventName["RESTART"]);
      }, 100);
    } else {
      console.log("🚀 ~ event.on ~ result:", result)
      event.trigger(EventName["EVALUATION.END"]);
      if (drawTimeout) {
        clearTimeout(drawTimeout);
        drawTimeout = 0;
      }
    }
  }
}

export default mod;