/**
 * @param {number|[number, number, number]|[number, number, number, number]|string} color
 */
export function translateColor(color = -1, alpha = 1) {
    if (color === -1) {
        return `rgba(0, 0, 0, 0)`;
    }
    if (typeof color === 'number') {
        return `rgba(${color}, ${color}, ${color}, ${alpha})`;
    }
    if (Array.isArray(color)) {
        const [r, g, b, a = alpha] = color;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return color
}
export const COLOR_BLACK = 0
export const COLOR_WHITE = 255
export const COLOR_WHITE_OPAQUE = [255, 255, 255, 125]
export const COLOR_GRAY = 40
export const COLOR_BLUE = [0, 0, 255]
export const COLOR_PLAYER = [225, 225, 0]
export const COLOR_ENEMY = [255, 0, 0]
export const COLOR_PLAYER_OPAQUE = [225, 225, 0, 125]
export const COLOR_ENEMY_OPAQUE = [255, 0, 0, 125]
export const COLOR_STROKE_PLAYER_OPAQUE = [255, 255, 0, 130]
export const COLOR_STROKE_ENEMY_OPAQUE = [255, 30, 30, 130];
export const COLOR_STROKE_PLAYER = [255, 255, 0]
export const COLOR_STROKE_ENEMY = [255, 30, 30]
export const COLOR_BACKGROUND = [255, 127, 127]