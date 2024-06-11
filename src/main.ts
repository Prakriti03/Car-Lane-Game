import './style.css'
import {DIMENSIONS} from './constants';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

canvas.width = DIMENSIONS.CANVAS_WIDTH;
canvas.height = DIMENSIONS.CANVAS_HEIGHT;

function draw(){
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);


