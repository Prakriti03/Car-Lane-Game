import {
  LANE_WIDTH,
  CANVAS_DIMENSIONS,
  PLAYER_CAR_WIDTH,
  PLAYER_CAR_HEIGHT,
  LANE_COUNT,
} from "./constants";

export class PlayerCar {
  ctx: CanvasRenderingContext2D;
  lane: number;
  x: number;
  y: number;
  targetLane: number;
  animationProgress: number;
  animationSpeed: number;
  isAnimating: boolean;
  img : HTMLImageElement;


  constructor(ctx: CanvasRenderingContext2D, lane: number, imgPath : string) {
    this.ctx = ctx;
    this.lane = lane;
    this.x = lane * LANE_WIDTH + (LANE_WIDTH - PLAYER_CAR_WIDTH) / 2;
    this.y = CANVAS_DIMENSIONS.CANVAS_HEIGHT - PLAYER_CAR_HEIGHT - 20;
    this.targetLane = lane;
    this.animationProgress = 0;
    this.animationSpeed = 0.1;
    this.isAnimating = false;
    this.img = new Image();

    this.img.src = imgPath;
 
  }

  drawCar() {
    if (this.isAnimating) {
      this.updateAnimation();
    }
    this.ctx.drawImage(this.img, 59, 260, 150, 284, this.x, this.y, PLAYER_CAR_WIDTH, PLAYER_CAR_HEIGHT);
  }

  updateAnimation() {
    const startX = this.lane * LANE_WIDTH + (LANE_WIDTH - PLAYER_CAR_WIDTH) / 2;
    const endX =
      this.targetLane * LANE_WIDTH + (LANE_WIDTH - PLAYER_CAR_WIDTH) / 2;
    this.x = startX + (endX - startX) * this.animationProgress;

    this.animationProgress += this.animationSpeed;
    if (this.animationProgress >= 1) {
      this.animationProgress = 0;
      this.lane = this.targetLane;
      this.isAnimating = false;
    }
  }

  moveLeft() {
    if (this.lane > 0) {
      this.targetLane = this.lane - 1;
      this.x = this.lane * LANE_WIDTH + (LANE_WIDTH - PLAYER_CAR_WIDTH) / 2;
      this.isAnimating = true;
    }
  }

  moveRight() {
    if (this.lane < LANE_COUNT - 1) {
      this.targetLane = this.lane + 1;
      this.x = this.lane * LANE_WIDTH + (LANE_WIDTH - PLAYER_CAR_WIDTH) / 2;
      this.isAnimating = true;
    }
  }
}
