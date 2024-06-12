import {
  CANVAS_DIMENSIONS,
  LANE_WIDTH,
  OBSTACLE_CAR_WIDTH,
  OBSTACLE_CAR_HEIGHT,
} from "./constants";

export class ObstacleCar {
  ctx: CanvasRenderingContext2D;
  lane: number;
  x: number;
  y: number;
  speed: number;
  img : HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D, lane: number, speed: number, imgPath : string) {
    this.ctx = ctx;
    this.lane = lane;
    this.x = lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_CAR_WIDTH) / 2;
    this.y = -OBSTACLE_CAR_HEIGHT; // Start above the canvas
    this.speed = speed;
    this.img = new Image();
    this.img.src = imgPath;
  }

  draw() {
    this.ctx.drawImage(this.img, 407, 260, 150, 284, this.x, this.y, OBSTACLE_CAR_WIDTH, OBSTACLE_CAR_HEIGHT);
  }

  update() {
    this.y += this.speed;
  }

  isOffScreen(): boolean {
    return this.y > CANVAS_DIMENSIONS.CANVAS_HEIGHT;
  }

  drawScore() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "14px Arial";
    this.ctx.fillText(`+10`, this.x + OBSTACLE_CAR_WIDTH / 2 - 10, this.y - 10);
  }

  setSpeed(newSpeed: number) {
    this.speed = newSpeed;
  }
}
