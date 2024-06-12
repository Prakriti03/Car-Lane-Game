export class Score {
  ctx: CanvasRenderingContext2D;
  score: number;
  onScoreIncrement: () => void;

  constructor(ctx: CanvasRenderingContext2D, onScoreIncrement: () => void) {
    this.ctx = ctx;
    this.score = 0;
    this.onScoreIncrement = onScoreIncrement;
  }

  increment() {
    this.score += 10;
    this.onScoreIncrement();
  }

  draw() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
  }
}
