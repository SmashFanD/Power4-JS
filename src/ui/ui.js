import { TileMapHeight, TileMapWidth } from "../data/data.js"
import { COLOR_BACKGROUND } from "../utils/color.js"
import { drawBox } from "../utils/draw.js"
import { battleScreen } from "./screens/battle.js"
import { optionScreen } from "./screens/options.js"
import { titleScreen } from "./screens/title.js"

export const AllScreens = {
  TITLE: "TITLE",
  SETTINGS: "SETTINGS",
  BATTLE: "BATTLE"
}
class UI {
  constructor() {
    this.screens = {
      TITLE: titleScreen,
      SETTINGS: optionScreen,
      BATTLE: battleScreen
    }
    this.screen = this.screens.TITLE
  }
  setupTitleScreen() {
    for (const screen in this.screens) {
      if (screen === AllScreens.BATTLE) {
        this.screens[screen].reset()
        continue
      }
      this.screens[screen].setup()
      console.log(this.screens[screen])
    }
  }
  setupBattleScreen() {
    const battleWithSave = titleScreen.battleWithSave
    for (const screen in this.screens) {
      
      this.screens[screen].reset()
      console.log(this.screens[screen])
    }
    battleScreen.setup(battleWithSave)
  }
  goToScreen(nextScreen) {
    if (nextScreen && this.screens[nextScreen]) {
      if (nextScreen === AllScreens.BATTLE) {
        this.setupBattleScreen()
      } else if (nextScreen === AllScreens.TITLE && this.screen === this.screens[AllScreens.BATTLE]) {
        this.setupTitleScreen()
      }
      this.screen = this.screens[nextScreen];
      return
    }
    return
  }
  update() {
    this.screen.update()
  }
  draw() {
    drawBox(0, 0, TileMapWidth, TileMapHeight, COLOR_BACKGROUND)       
    this.screen.draw()
  }
  keyPressed() {
    this.goToScreen(this.screen.keyPressed());
  }
}

export const ui = new UI()