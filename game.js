import './libs/weapp-adapter'
import gameState from "./dist/modules/gameState";
import draw from "./dist/modules/draw";
import interaction from "./dist/modules/interaction";
import pieces from "./dist/modules/pieces";
import ai from "./dist/modules/ai";

function loop() {
  const ctx = canvas.getContext('2d');
  draw.draw(ctx);

  window.requestAnimationFrame(loop);
}

function init() {
  const ctx = canvas.getContext('2d');
  gameState.init();
  interaction.init();
  draw.init(ctx);
  pieces.init();
  ai.init();
  window.requestAnimationFrame(loop)
}

init();