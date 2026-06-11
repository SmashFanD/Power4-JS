import { CTX } from "../gameloop.js";
import { setDrawData } from "./draw.js";
export function drawText(text, x, y, size, color, strokeSize, strokeColor) {
    CTX.font = `${size ?? 0}px BlackWhite`
    setDrawData(color, strokeSize, strokeColor)
    CTX.strokeText(text, x, y);
    CTX.fillText(text, x, y);
}