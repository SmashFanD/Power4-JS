export const CANVAS_WIDTH = 1120;
export const CANVAS_HEIGHT = 672;
export function getTextHeight(size) {
   return Math.ceil(size * 0.82)
}
export function getTextWidth(size, length) {
  return Math.ceil(size * length * 0.375)
}
export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
