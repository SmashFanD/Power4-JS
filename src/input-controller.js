import { Snd_Select } from "./constant/sound/ui.js";
import { musicPlayer } from "./music.js";


export function updateIndexY(yIndex, min, max, mult) {
    if (!min) min = 0
    if (!max) max = 0
    if (!mult) mult = 1
    let dy = 0;
    if (input.has(Button.UP)) dy = -1 * mult
    if (input.has(Button.DOWN)) dy = 1 * mult
    const range = max - min + 1;
    return (((yIndex + dy - min) % range) + range) % range + min;
}
export function updateIndexX(xIndex, min, max, mult) {
    if (!min) min = 0
    if (!max) max = 0
    if (!mult) mult = 1
    let dx = 0
    if (input.has(Button.LEFT)) dx -= 1 * mult
    if (input.has(Button.RIGHT)) dx += 1 * mult
    const range = max - min + 1;
    return  (((xIndex + dx - min) % range) + range) % range + min
}
export function updateIndexUpward(xIndex, min, max) {
    if (!min) min = 0
    if (!max) max = 0
    let dx = 1
    const range = max - min + 1;
    return  (((xIndex + dx - min) % range) + range) % range + min
}

export const Button = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  SUBMIT: 4,
  ACTION: 5,
  CANCEL: 6,
  MENU: 7,
  STATS: 8,
  CYCLE_SHINY: 9,
  CYCLE_FORM: 10,
  CYCLE_GENDER: 11,
  CYCLE_ABILITY: 12,
  CYCLE_NATURE: 13,
  CYCLE_TERA: 14
}

const KEY_MAP = {
    'z': Button.ACTION, 'Z': Button.ACTION,
    'x': Button.CANCEL, 'X': Button.CANCEL,
    'Enter': Button.MENU,
    'Shift': Button.STATS,
    'n': Button.CYCLE_NATURE, 'N': Button.CYCLE_NATURE,
    'a': Button.CYCLE_ABILITY, 'A': Button.CYCLE_ABILITY,
    'g': Button.CYCLE_GENDER, 'G': Button.CYCLE_GENDER,
    'f': Button.CYCLE_FORM, 'F': Button.CYCLE_FORM,
    's': Button.CYCLE_SHINY, 'S': Button.CYCLE_SHINY,
    'u': Button.SUBMIT, 'U': Button.SUBMIT,
    'ArrowUp': Button.UP,
    'ArrowRight': Button.RIGHT,
    'ArrowDown': Button.DOWN,
    'ArrowLeft': Button.LEFT
};

export function translateInput(key) {
    return KEY_MAP[key];
}
class InputController {
    constructor() {
        this.keysPressed = new Set();
        this.current = new Set();
    }
    keyPressed(key) {
        console.log("Key pressed:", key);
        this.keysPressed.add(key);
    }
    //this add each of the current keysPressed to the input set
    // (called at start of each gameloop) so that the input doesn't go missing during a frame
    inputAdd() {
        this.current.clear();
        for (const key of this.keysPressed) {
            const button = translateInput(key);
            if (button !== undefined) {
              this.current.add(button);
            }
        }
        this.keysPressed.clear();
    }
    has(button, checkAll = false) {
        let hasButton
        if (Array.isArray(button)) {
            hasButton = this.checkInput(button, checkAll);
        } else hasButton = this.current.has(button);
        if (!hasButton) return false
        Snd_Select.play()
        return true
    }
    checkInput(input, checkAll) {
        return checkAll ? input.every(b => this.current.has(b)) : input.some(b => this.current.has(b))
    }
}
export const input = new InputController();