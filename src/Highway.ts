// Highway.ts
import { LANE_COUNT, LANE_WIDTH } from "./constants";

export class Highway {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  laneHeight: number;
  speed: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    speed: number
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.laneHeight = 0;
    this.speed = speed;
  }

  draw() {
    // Background
    this.ctx.fillStyle = '#474747';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Lane lines
    const lineWidth = 10;
    const gapHeight = 20;
    const lineHeight = 30;

    this.ctx.fillStyle = "white";

    for (let lane = 1; lane < LANE_COUNT; lane++) {
      const x = lane * LANE_WIDTH - lineWidth / 2;

      for (
        let y = -lineHeight;
        y < this.canvas.height;
        y += lineHeight + gapHeight
      ) {
        this.ctx.fillRect(x, y + this.laneHeight, lineWidth, lineHeight);
      }
    }
  }

  update() {
    this.laneHeight += this.speed;
    if (this.laneHeight >= 50) {
      this.laneHeight = 0;
    }
  }

  setSpeed(newSpeed: number) {
    this.speed = newSpeed;
  }
}
