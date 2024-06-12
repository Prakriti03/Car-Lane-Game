import {
    MIN_OBSTACLE_INTERVAL,
    MIN_OBSTACLE_GAP,
    MAX_OBSTACLE_INTERVAL,
    LANE_COUNT,
    OBSTACLE_CAR_HEIGHT,
    OBSTACLE_CAR_WIDTH,
    PLAYER_CAR_HEIGHT,
    PLAYER_CAR_WIDTH,
  } from "./constants";
  import { Highway } from "./Highway";
  import { PlayerCar } from "./PlayerCar";
  import { ObstacleCar } from "./ObstacleCar";
  import { getRandomInt } from "./utils";
  import { Score } from "./Score";
  
  export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    highway: Highway;
    playerCar: PlayerCar;
    score: Score;
    obstacles: ObstacleCar[] = [];
    lastObstacleTime: number = 0;
    lastSpawnTime: number = 0;
    speed: number = 2;
    highScore: number;
  
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, highScore: number) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.highway = new Highway(ctx, canvas, this.speed);
      this.playerCar = new PlayerCar(ctx, 1, "Images/Car-Sprite.png");
      this.score = new Score(ctx, this.incrementSpeed.bind(this), highScore);
      this.highScore = highScore;
    }
  
    incrementSpeed() {
      this.speed += 0.3;
      this.highway.setSpeed(this.speed);
      this.obstacles.forEach((obstacle) => obstacle.setSpeed(this.speed));
    }
  
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Set background color to black
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.highway.draw();
      this.highway.update();
  
      this.playerCar.drawCar();
  
      // Draw and update obstacle cars
      const now = performance.now();
      if (
        now - this.lastObstacleTime >
        getRandomInt(MIN_OBSTACLE_INTERVAL, MAX_OBSTACLE_INTERVAL)
      ) {
        this.generateObstacle();
        this.lastObstacleTime = now;
      }
  
      this.obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw();
  
        // Remove off-screen obstacles
        if (obstacle.isOffScreen()) {
          this.obstacles.splice(index, 1);
          this.score.increment();
        }
  
        // Check for collisions
        if (this.isCollision(this.playerCar, obstacle)) {
          this.gameOver();
        }
        obstacle.drawScore();
      });
  
      this.score.draw();
      requestAnimationFrame(this.draw.bind(this));
    }
  
    generateObstacle() {
      const now = performance.now();
      if (now - this.lastSpawnTime < MIN_OBSTACLE_INTERVAL) {
        return;
      }
  
      const lanes = Array(LANE_COUNT).fill(true); // Initially assume all lanes are valid
      this.obstacles.forEach((obstacle) => {
        if (obstacle.y < MIN_OBSTACLE_GAP) {
          lanes[obstacle.lane] = false; // Mark lane as invalid if the obstacle is too close
        }
      });
  
      // Ensure at least one lane and a navigable path are always free
      const validLanes = lanes
        .map((isValid, index) => (isValid ? index : -1))
        .filter((index) => index !== -1);
      const navigableLanes = validLanes.filter((lane) => {
        // Check if adjacent lanes are navigable
        const leftLaneFree =
          lane === 0 ||
          (lanes[lane - 1] &&
            this.obstacles.every(
              (obs) => obs.lane !== lane - 1 || obs.y >= MIN_OBSTACLE_GAP
            ));
        const rightLaneFree =
          lane === LANE_COUNT - 1 ||
          (lanes[lane + 1] &&
            this.obstacles.every(
              (obs) => obs.lane !== lane + 1 || obs.y >= MIN_OBSTACLE_GAP
            ));
        return leftLaneFree && rightLaneFree;
      });
  
      if (navigableLanes.length > 0) {
        const lane = navigableLanes[getRandomInt(0, navigableLanes.length)];
        this.obstacles.push(new ObstacleCar(this.ctx, lane, this.speed, "Images/Car-Sprite.png"));
        this.lastSpawnTime = now;
      }
    }
  
    isCollision(player: PlayerCar, obstacle: ObstacleCar): boolean {
      return (
        player.x < obstacle.x + OBSTACLE_CAR_WIDTH &&
        player.x + PLAYER_CAR_WIDTH > obstacle.x &&
        player.y < obstacle.y + OBSTACLE_CAR_HEIGHT &&
        player.y + PLAYER_CAR_HEIGHT > obstacle.y
      );
    }
  
    gameOver() {
      if (this.score.score > this.highScore) {
        this.highScore = this.score.score;
        localStorage.setItem("highScore", this.highScore.toString());
      }
      alert(`Game Over! Your Final Score is ${this.score.score}. High Score : ${this.highScore}`);
      window.location.reload(); // Restart the game
    }
  
    start() {
      requestAnimationFrame(this.draw.bind(this));
    }
  }
  