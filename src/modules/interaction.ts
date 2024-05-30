/// <reference path="../../node_modules/minigame-api-typings/index.d.ts" />
import { EventName } from "../typings/index";
import event from "./event";
let restart = false;

export default {
  init() {
    // 监听触摸事件
    wx.onTouchStart((e: WechatMinigame.OnTouchStartListenerResult) => {
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
  }
}
