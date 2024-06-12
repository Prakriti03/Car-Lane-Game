import "./style.css";
import {
  CANVAS_DIMENSIONS,
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


const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const canvasContainer =
  document.querySelector<HTMLDivElement>(".game-container")!;
const ctx = canvas.getContext("2d")!;
const startButton = document.querySelector<HTMLButtonElement>("#startButton")!;

canvas.height = CANVAS_DIMENSIONS.CANVAS_HEIGHT;
canvas.width = CANVAS_DIMENSIONS.CANVAS_WIDTH;

let speed = 2;

const highway = new Highway(ctx, canvas, speed);
const playerCar = new PlayerCar(ctx, 1, 'Images/Car-Sprite.png');
const score = new Score(ctx, () => {
  speed += 0.3;
  highway.setSpeed(speed);
  obstacles.forEach((obstacle) => obstacle.setSpeed(speed));
});

const obstacles: ObstacleCar[] = [];
let lastObstacleTime = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set background color to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  highway.draw();
  highway.update();

  playerCar.drawCar();

  // Draw and update obstacle cars
  const now = performance.now();
  if (
    now - lastObstacleTime >
    getRandomInt(MIN_OBSTACLE_INTERVAL, MAX_OBSTACLE_INTERVAL)
  ) {
    generateObstacle();
    lastObstacleTime = now;
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.update();
    obstacle.draw();

    // Remove off-screen obstacles
    if (obstacle.isOffScreen()) {
      obstacles.splice(index, 1);
      score.increment();
    }

    // Check for collisions
    if (isCollision(playerCar, obstacle)) {
      gameOver();
    }
    obstacle.drawScore();
  });

  score.draw();
  requestAnimationFrame(draw);
}
let lastSpawnTime = 0;
function generateObstacle() {
  const now = performance.now();
  if (now - lastSpawnTime < MIN_OBSTACLE_INTERVAL) {
    return;
  }

  const lanes = Array(LANE_COUNT).fill(true); // Initially assume all lanes are valid
  obstacles.forEach((obstacle) => {
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
        obstacles.every(
          (obs) => obs.lane !== lane - 1 || obs.y >= MIN_OBSTACLE_GAP
        ));
    const rightLaneFree =
      lane === LANE_COUNT - 1 ||
      (lanes[lane + 1] &&
        obstacles.every(
          (obs) => obs.lane !== lane + 1 || obs.y >= MIN_OBSTACLE_GAP
        ));
    return leftLaneFree && rightLaneFree;
  });

  if (navigableLanes.length > 0) {
    const lane = navigableLanes[getRandomInt(0, navigableLanes.length)];
    obstacles.push(new ObstacleCar(ctx, lane, speed, 'Images/Car-Sprite.png'));
    lastSpawnTime = now;
  }
}

function isCollision(player: PlayerCar, obstacle: ObstacleCar): boolean {
  return (
    player.x < obstacle.x + OBSTACLE_CAR_WIDTH &&
    player.x + PLAYER_CAR_WIDTH > obstacle.x &&
    player.y < obstacle.y + OBSTACLE_CAR_HEIGHT &&
    player.y + PLAYER_CAR_HEIGHT > obstacle.y
  );
}

function gameOver() {
  alert(`Game Over! Your Final Score is ${score.score}`);
  window.location.reload(); // Restart the game
}

function startGame() {
  startButton.style.display = "none";
  canvasContainer.style.display = "flex";
  requestAnimationFrame(draw);
}

startButton.addEventListener("click", startGame);
// Event listeners for player car movement
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      playerCar.moveLeft();
      break;
    case "ArrowRight":
      playerCar.moveRight();
      break;
  }
});
