import { CTX } from "../gameloop.js"
import { translateColor } from "./color.js"

export function drawBox(x, y, sizeX, sizeY, fillColor, strokeColor, strokeSize) {
    const size_X = Math.round(sizeX)
    const size_Y = Math.round(sizeY)
    const posX = Math.round(x)
    const posY = Math.round(y)
    setDrawData(fillColor, strokeSize, strokeColor)
    CTX.fillRect(posX, posY, size_X, size_Y)
    CTX.strokeRect(posX, posY, size_X, size_Y);
}
export function drawCircle(x, y, radius, fillColor, strokeColor, strokeSize, start, end, counterClock) {
    const size = Math.round(radius)
    const posX = Math.round(x)
    const posY = Math.round(y)
    setDrawData(fillColor, strokeSize, strokeColor)
    CTX.beginPath();
    CTX.arc(posX, posY, size, start ?? 0, end ?? 2 * Math.PI, counterClock)
    CTX.fill()
    CTX.stroke();
}

export function setDrawData(color, strokeSize, strokeColor) {
    CTX.lineWidth = strokeSize ?? 0;
    CTX.strokeStyle = translateColor(strokeColor)
    CTX.fillStyle = translateColor(color)
}