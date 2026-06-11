import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./utils/common.js";
import { globalScene } from "./global-scene.js";
import { input } from "./input-controller.js";

function getCanvas(canvas) {
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Canvas element not found or not a canvas!');
    }
    return canvas;
}
function getCTX(ctx) {
    if (!ctx) {
        throw new Error('Failed to get 2D context!');
    }
    return ctx;
}
export const CANVAS = getCanvas(document.getElementById('POWER4'));
CANVAS.width = CANVAS_WIDTH
CANVAS.height = CANVAS_HEIGHT
export const CTX = getCTX(CANVAS.getContext('2d'));

CTX.imageSmoothingEnabled = false;
CTX.mozImageSmoothingEnabled = false;
const font = new FontFace("BlackWhite", "url('./font/pokemon-bw.ttf')");
await font.load();
document.fonts.add(font);
CTX.font = "40px BlackWhite";
export const TARGET_FPS = 30;
export const FRAME_INTERVAL = 1000 / TARGET_FPS;
export let lastTime = performance.now();


window.addEventListener("keydown", (e) => {
  if (!e.key) return
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
  if (!e.repeat) {
    if (e.key === "p" || e.key === "P") {
      globalScene.isPaused = !globalScene.isPaused;
      return;
    }
    input.keyPressed(e.key);
  }
}); 

function gameLoop(currentTime) {
  if (globalScene.isPaused) {
    requestAnimationFrame(gameLoop);
    return;
  }
  if (currentTime - lastTime >= FRAME_INTERVAL) {
    update();
    draw();
    lastTime = currentTime;
    input.inputAdd()
    keyPressed()
  }
  requestAnimationFrame(gameLoop);
}
await globalScene.setup()
requestAnimationFrame(gameLoop);

function keyPressed() {
  if (input.current.size < 1) return
  globalScene.keyPressed()
}
function update() {

  globalScene.update();
}

function draw() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  globalScene.draw();
}