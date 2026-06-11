
import { IMG_UI_CURSOR } from "../../constant/img/ui.js"
import { input, Button, updateIndexY } from "../../input-controller.js"
import { COLOR_BLACK, COLOR_WHITE } from "../../utils/color.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../utils/common.js"
import { drawBox } from "../../utils/draw.js"
import { drawText } from "../../utils/text.js"
import { AllScreens, ui } from "../ui.js"
import { createTextMenuX, mapOptionsKeys } from "./helper.js"


class TitleScreen {
    setup() {
      this.cursorIndex = 0
      const menuConfig = {
        texts: {
          NEW_RUN: "New Game",
          CONTINUE: "Continue",
          SETTINGS: "Settings"
        },
        textSize: 40,
        textOutlineSize: 4,
        boxOutlineSize: 4
      };
      this.texts = menuConfig.texts
      const {
        newObjectItem,
        newObjectId
      } = mapOptionsKeys(this.texts)
            
      /** @type {{ NEW_RUN: 0, CONTINUE: 1, SETTINGS: 2 }} */
      this.optionId = newObjectItem
      this.optionLength = newObjectId
      
      const {
        textDataX,
        textDataY,
        cursorDataX,
        cursorDataY,
        cursorDataSize,
        boxDataX,
        boxDataY,
        boxDataSizeX,
        boxDataSizeY
      } = createTextMenuX(
        this.texts,
        true,
        CANVAS_WIDTH - 3,
        CANVAS_HEIGHT - 3,
        menuConfig.textSize,
        0,
        true,
        true,
        menuConfig.boxOutlineSize,
        menuConfig.textOutlineSize
      )
      
      this.textDataX = textDataX
      /** 
        * @type {{
        * 0: {Y: number},
        * 1: {Y: number},
        * 2: {Y: number},
        * }}
        */
      this.textDataY = {
        0: textDataY[0],
        1: textDataY[1],
        2: textDataY[2]
      }
      this.textSize = menuConfig.textSize
      this.textOutlineSize = menuConfig.textOutlineSize

      this.cursorY = cursorDataY
      this.cursorX = cursorDataX
      this.cursorSize = cursorDataSize
      this.boxDataX = boxDataX
      this.boxDataY = boxDataY
      this.boxDataSizeX = boxDataSizeX
      this.boxDataSizeY = boxDataSizeY
      this.boxDataColor = [130, 20, 20]
      this.boxDataStrokeColor = [185, 80, 80]
      this.boxOutlineSize = menuConfig.boxOutlineSize
    }
    update() {
      
    }
    draw() {
      drawBox(this.boxDataX, this.boxDataY,
        this.boxDataSizeX, this.boxDataSizeY,
        this.boxDataColor, this.boxDataStrokeColor, this.boxOutlineSize)
      let i = -1
      for (const t in this.texts) {
        i++
        drawText(this.texts[t], this.textDataX, this.textDataY[i],
          this.textSize, COLOR_WHITE, this.textOutlineSize, COLOR_BLACK
        )
      }
      IMG_UI_CURSOR.draw(
        this.cursorX,
        this.cursorY[this.cursorIndex],
        this.cursorSize,
        this.cursorSize
      )
    }
    keyPressed() {
      if (input.has(Button.MENU)) {
        return AllScreens.SETTINGS
      }
      if (input.has(Button.ACTION)) {
        if (this.cursorIndex === this.optionId.NEW_RUN) {
          return AllScreens.BATTLE
        }
        if (this.cursorIndex === this.optionId.CONTINUE) {
          this.battleWithSave = true
          return AllScreens.BATTLE
        }
        if (this.cursorIndex === this.optionId.SETTINGS) {
          return AllScreens.SETTINGS
        }
      }
      this.cursorIndex = updateIndexY(this.cursorIndex, 0, this.optionLength)
      console.log(this)
      return null
    }
    reset() {
      for (const key in this) {
        delete this[key]
      }
    }
}
export const titleScreen = new TitleScreen()