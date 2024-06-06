/// <reference path="../../node_modules/minigame-api-typings/index.d.ts" />
import { EventName, NextPieceType } from "../typings/index";
import ai from "./ai";
import event from "./event";
let restart = false;
let ignore = false;

export default {
  init() {
    // 监听触摸事件
    wx.onTouchStart((e: WechatMinigame.OnTouchStartListenerResult) => {
      if (ignore) {
        return;
      }
      if (restart) {
        event.trigger(EventName["RESTART"]);
        restart = false;
      } else {
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
