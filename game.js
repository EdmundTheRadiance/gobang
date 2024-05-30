import './libs/weapp-adapter'
import draw from "./dist/modules/draw";
import interaction from "./dist/modules/interaction";
import pieces from "./dist/modules/pieces";

function loop() {
  const ctx = canvas.getContext('2d');
  draw.draw(ctx);

  window.requestAnimationFrame(loop);
}

function init() {
  const ctx = canvas.getContext('2d');
  interaction.init();
  draw.init(ctx);
  pieces.init();
  window.requestAnimationFrame(loop)
}

init();