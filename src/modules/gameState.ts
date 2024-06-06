import { EventName, PieceType, GameState } from "../typings/index";
import ai from "./ai";
import event from "./event";

let currentState: GameState = GameState.END;
const enterStateFuncMap: { [key in GameState] ? : () => void } = {};
const exitStateFuncMap: { [key in GameState] ? : () => void } = {};

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
  ai.createAIPlayer(PieceType.BLACK);
}

const mod = {
  GameState,
  init() {
    mod.transitionTo(GameState.PLAYING);
    event.on(EventName["WIN"], () => {
      mod.transitionTo(GameState.END);
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
  }
}

export default mod;