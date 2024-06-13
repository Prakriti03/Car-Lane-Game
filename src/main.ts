import "./style.css";
import { Game } from "./Game";
import { CANVAS_DIMENSIONS } from "./constants";

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const canvasContainer = document.querySelector<HTMLDivElement>(".game-container")!;
const ctx = canvas.getContext("2d")!;
const startButton = document.querySelector<HTMLButtonElement>("#startButton")!;

canvas.height = CANVAS_DIMENSIONS.CANVAS_HEIGHT;
canvas.width = CANVAS_DIMENSIONS.CANVAS_WIDTH;

let highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
const game = new Game(canvas, ctx, highScore);

function startGame() {
  startButton.style.display = "none";
  canvasContainer.style.display = "flex";
  game.start();
}

startButton.addEventListener("click", startGame);

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      game.playerCar.moveLeft();
      break;
    case "ArrowRight":
      game.playerCar.moveRight();
      break;
  }
});
