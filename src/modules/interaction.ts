/// <reference path="../../node_modules/minigame-api-typings/index.d.ts" />
import { EventName, NextPieceType, PieceType } from "../typings/index";
import ai from "./ai";
import event from "./event";
let restart = false;
let ignore = false;

export default {
  init() {
    ignore = ai.isAITurn(PieceType.WHITE);
    // 监听触摸事件
    wx.onTouchStart((e: WechatMinigame.OnTouchStartListenerResult) => {
      if (restart) {
        ignore = ai.isAITurn(PieceType.WHITE);
        restart = false;
        event.trigger(EventName["RESTART"]);
      } else if (!ignore) {
        event.trigger(EventName["INTERFACE.CLICK"], { x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    });

    event.on(EventName["WIN"], () => {
      restart = true;
    });

    event.on(EventName["PIECES.ADD"], ([ , , pieceType]) => {
      ignore = ai.isAITurn(NextPieceType[pieceType]);
    });
  }
}
