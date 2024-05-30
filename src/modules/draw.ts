import { COLUMN_NUM, ROW_NUM } from "../config";
import { EventName, PieceType } from "../typings/index";
import event from "./event";
import pieces from "./pieces";

const marginTop = 100;
const padding = 20;
const pieceColor = {
  [PieceType.WHITE]: 'white',
  [PieceType.BLACK]: 'black',
}
const PieceTypeText = {
  [PieceType.WHITE]: '白',
  [PieceType.BLACK]: '黑',
}
export default {
  init(ctx: CanvasRenderingContext2D) {
    event.on(EventName["INTERFACE.CLICK"], ({ x, y }: { x: number, y: number }) => {
      const { width } = ctx.canvas;
      const cellWidth = (width - padding * 2) / COLUMN_NUM;
      const cellHeight = (width - padding * 2) / ROW_NUM;
      const touchPadding = padding - cellWidth / 2;
      if (
        x > touchPadding
        && x < width - touchPadding
        && y > marginTop + touchPadding
        && y < width + marginTop - touchPadding
      ) {
        const _x = x - padding;
        const _y = y - marginTop - padding;
        let col = Math.floor(_x / cellWidth);
        let row = Math.floor(_y / cellHeight);
        (_x % cellWidth) > cellWidth / 2 && (col++);
        (_y % cellHeight) > cellHeight / 2 && (row++);
        event.trigger(EventName["CELL.CLICK"], [row, col]);
      }
    });

    event.on(EventName["WIN"], (pieceType: PieceType) => {
      const { width } = ctx.canvas;
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "yellow";
      ctx.fillText(`${PieceTypeText[pieceType]}棋胜，点击屏幕重新开始`, width / 2, width + marginTop + 30);
    });

    event.on(EventName["RESTART"], () => {
      const { width } = ctx.canvas;
      ctx.clearRect(0, width + marginTop, width, 100);
    });
  },
  draw(ctx: CanvasRenderingContext2D) {
    this.drawBoard(ctx);
    this.drawPieces(ctx);
  },
  drawBoard(ctx: CanvasRenderingContext2D) {
    const { width } = ctx.canvas;
    // 设置棋盘背景色
    ctx.fillStyle = "#DDBB55";
    ctx.fillRect(0, marginTop, width, width);

    // 计算每个格子的大小
    const cellWidth = (width - padding * 2) / COLUMN_NUM;
    const cellHeight = (width - padding * 2) / ROW_NUM;

    // 设置线条颜色
    ctx.strokeStyle = "#000000";

    // 绘制行
    for (let i = 0; i <= ROW_NUM; i++) {
      ctx.beginPath();
      ctx.moveTo(padding, i * cellHeight + marginTop + padding);
      ctx.lineTo(width - padding, i * cellHeight + marginTop + padding);
      ctx.stroke();
    }

    // 绘制列
    for (let j = 0; j <= COLUMN_NUM; j++) {
      ctx.beginPath();
      ctx.moveTo(j * cellWidth + padding, marginTop + padding);
      ctx.lineTo(j * cellWidth + padding, width + marginTop - padding);
      ctx.stroke();
    }
  },
  drawPieces(ctx: CanvasRenderingContext2D) {
    const pieceList = pieces.getPieces();
    pieceList.forEach((rowList, row) => {
      rowList.forEach((piece, col) => {
        piece && this.drawPiece(ctx, piece.getPieceType(), row, col);
      });
    });
  },
  drawPiece(ctx: CanvasRenderingContext2D, pieceType: PieceType, row: number, col: number) {
    const { width } = ctx.canvas;
    // 计算每个格子的大小
    const cellWidth = (width - padding * 2) / COLUMN_NUM;
    const cellHeight = (width - padding * 2) / ROW_NUM;
    const centerX = col * cellWidth + padding;
    const centerY = row * cellHeight + padding + marginTop;
    const radius = Math.min(cellWidth, cellHeight) / 2 * 0.75;  // 0.75 是为了让棋子看起来更小一些

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = pieceColor[pieceType];
    ctx.fill();
  }
}