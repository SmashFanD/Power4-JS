import { IMG_UI_CURSOR } from "../../constant/img/ui.js"
import { SND_Background } from "../../constant/sound/bgm.js"
import { SaveDataType } from "../../enums/savedata-type.js"
import { globalScene } from "../../global-scene.js"
import { input, Button, updateIndexY, updateIndexUpward, updateIndexX } from "../../input-controller.js"
import { musicPlayer } from "../../music.js"
import { COLOR_BLACK, COLOR_GRAY, COLOR_WHITE } from "../../utils/color.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, getKeyByValue } from "../../utils/common.js"
import { drawBox } from "../../utils/draw.js"
import { SND_BG_KEYS, SND_BG_NAME_TO_INDEX, SND_BG_VALUES } from "../../utils/keys-objects.js"
import { doSave } from "../../utils/save.js"
import { drawText } from "../../utils/text.js"
import { AllScreens } from "../ui.js"
import { mapOptionsKeys, createTextMenuX, createTextNoMenuX } from "./helper.js"


const BGM_FORCED = "BGM_FORCED"
const BGM_CHOICE = "BGM_CHOICE"
const BGM_CACHE = "BGM_CACHE"
const DIFFICULTY = "DIFFICULTY"


class OptionScreen {

    firstMenuSetup() {
      this.cursorIndex = 0

      this.textsTypes = {
        GAME: "gameSettings",
        SOUND: "soundSettings"
      }

      this.optionsTypes = {
        GAME: 0,
        SOUND: 1
      }

      const {
        newObjectItem,
        newObjectId
      } = mapOptionsKeys(this.textsTypes)
      
      /** @type {{ GAME: 0, SOUND: 1 }} */
      this.options = newObjectItem
      this.optionsLength = newObjectId
      
      this.textSize = 40
      this.textOutlineSize = 4

      this.boxDataStrokeSize = 4

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
        this.textsTypes,
        true,
        3,
        3,
        this.textSize,
        14,
        false,
        false,
        this.boxDataStrokeSize,
        this.textOutlineSize
      )

      this.textsDataTypeX = textDataX
      /** 
        * @type {{
        * 0: {Y: number},
        * 1: {Y: number},
        * }}
        */
      this.textsDataTypeY = {
        0: textDataY[0],
        1: textDataY[1]
      }
      this.cursorDataTypeX = cursorDataX
      this.cursorDataTypeY = cursorDataY
      this.cursorDataTypeSize = cursorDataSize
      this.boxDataTypeX = boxDataX
      this.boxDataTypeY = boxDataY
      this.boxDataTypeSizeX = boxDataSizeX
      this.boxDataTypeSizeY = boxDataSizeY
      this.boxDataColor = [130, 20, 20]
      this.boxDataStrokeColor = [185, 80, 80]
    }
    subOptionsSetup() {
      this.subCursorIndex = 0
      this.optionDifficultyMult = 1
      this.subOptions = false

      this.textsOptionGame = {
        DIFFICULTY: "Difficulty:"
      }

      const {
        newObjectItem: newGameItem,
        newObjectId: newGameId
      } = mapOptionsKeys(this.textsOptionGame)
      
      /** @type {{DIFFICULTY: 0 }} */
      this.optionGame = newGameItem
      this.optionsLengthGame = newGameId
      
      this.textsOptionSound = {
        BGM_CHOICE: "Current BGM:",
        BGM_FORCED: "Force current BGM:",
        BGM_CACHE: "Number of BGM in cache:"
      }

      const {
        newObjectItem,
        newObjectId
      } = mapOptionsKeys(this.textsOptionSound)
      
      /** @type {{BGM_CHOICE: 0, BGM_FORCED: 1, BGM_CACHE: 2}} */
      this.optionSound = newObjectItem
      this.optionsLengthSound = newObjectId

      const X = this.boxDataTypeX + this.boxDataTypeSizeX + 6

      this.textsOptionStrokeSize = 4
      this.textsOptionSize = 37

      this.boxOptionsStrokeSize = 4
      const {
        textDataX,
        textDataY,
        cursorDataX,
        cursorDataY,
        cursorDataSize,
      } = createTextNoMenuX(
        this.optionSound,
        true,
        this.boxDataTypeX + this.boxDataTypeSizeX + 6,
        15,
        this.textsOptionSize,
        16,
        false,
        false,
        this.textsOptionStrokeSize
      )

      this.textsOptionX = textDataX
      this.textsOptionY = textDataY
      this.cursorOptionX = cursorDataX
      this.cursorOptionY = cursorDataY
      this.cursorOptionSize = cursorDataSize
    }
    setup() {
      this.boxDataBgColor = [130, 20, 20]
      this.boxDataBgColorStroke = [185, 80, 80]
      this.boxDataBgStrokeSize = 4
      this.boxDataBgX = 3
      this.boxDataBgY = 3
      this.boxDataBgSizeX = CANVAS_WIDTH - 6
      this.boxDataBgSizeY = CANVAS_HEIGHT - 6

      this.firstMenuSetup()
      this.subOptionsSetup()
      this.selectedMusic = globalScene.musicBg

      this.difficulty = globalScene.difficulty
    }
    saveOptionGoToMenu() {
      doSave(globalScene, SaveDataType.SETTINGS)
      return AllScreens.TITLE
    }
    optionTextsToShow() {
      switch(this.cursorIndex) {
        case this.options.SOUND:
          const bgmForced = globalScene.musicForced ? COLOR_GRAY : COLOR_WHITE
          let i = -1
          for (const k in this.textsOptionSound) {
            i++
            if (k === BGM_FORCED) {
              const isForced = globalScene.musicForced ? "On" : "Off"
              drawText(
                `${this.textsOptionSound[k]} ${isForced}`,
                this.textsOptionX, this.textsOptionY[i], this.textsOptionSize,
                bgmForced, this.textsOptionStrokeSize, COLOR_BLACK
              )
              continue
            }
            if (k === BGM_CHOICE) {
              drawText(
                `${this.textsOptionSound[k]} ${this.selectedMusic.NAME}`,
                this.textsOptionX, this.textsOptionY[i], this.textsOptionSize,
                bgmForced, this.textsOptionStrokeSize, COLOR_BLACK
              )
              continue
            }
            if (k === BGM_CACHE) {
              drawText(`${this.textsOptionSound[k]} ${musicPlayer.bgmMaxCache}`, 
                this.textsOptionX, this.textsOptionY[i], this.textsOptionSize,
                COLOR_WHITE, this.textsOptionStrokeSize, COLOR_BLACK
              )
              continue
            }
            drawText(this.textsOptionSound[k], 
              this.textsOptionX, this.textsOptionY[i], this.textsOptionSize,
              COLOR_WHITE, this.textsOptionStrokeSize, COLOR_BLACK
            );
          }
          break;
        case this.options.GAME:
          let u = -1
          for (const k in this.textsOptionGame) {
            u++
            if (k === DIFFICULTY) {
              drawText(`${this.textsOptionGame[k]} ${this.difficulty.toFixed(2)}`, 
                this.textsOptionX, this.textsOptionY[u], this.textsOptionSize,
                COLOR_WHITE, this.textsOptionStrokeSize, COLOR_BLACK
              )
              continue
            }
            drawText(this.textsOptionGame[k], this.textsOptionX, this.textsOptionY[u], this.textsOptionSize,
              COLOR_WHITE, this.textsOptionStrokeSize, COLOR_BLACK
            );
          }
          break;
      }
    }
    update() {
      
    }
    draw() {
      drawBox(this.boxDataBgX, this.boxDataBgY, this.boxDataBgSizeX, this.boxDataBgSizeY,
        this.boxDataBgColor, this.boxDataBgColorStroke, this.boxDataBgStrokeSize
      );
      drawBox(this.boxDataTypeX, this.boxDataTypeY, this.boxDataTypeSizeX, this.boxDataTypeSizeY,
        this.boxDataColor, this.boxDataBgColorStroke, this.boxDataStrokeSize
      )
      let i = -1
      for (const t in this.textsTypes) {
        i++
        drawText(this.textsTypes[t], this.textsDataTypeX, this.textsDataTypeY[i], this.textSize,
          COLOR_WHITE, this.textOutlineSize, COLOR_BLACK
        )
      }

      this.optionTextsToShow()
      if (this.subOptions) {
        IMG_UI_CURSOR.draw(
          this.cursorOptionX,
          this.cursorOptionY[this.subCursorIndex],
          this.cursorOptionSize,
          this.cursorOptionSize)
      }
      IMG_UI_CURSOR.draw(
        this.cursorDataTypeX,
        this.cursorDataTypeY[this.cursorIndex],
        this.cursorDataTypeSize,
        this.cursorDataTypeSize)
    }
    keyPressed() {
      if (input.has(Button.MENU)) {
        return this.saveOptionGoToMenu()
      }
      if (input.has(Button.CANCEL)) {
        const returnValue = this.inputIsCancel()
        return returnValue
      }
      if (input.has(Button.ACTION)) {
        this.inputIsAction();
        return null
      }
      if (!this.subOptions) {
        this.cursorIndex = updateIndexY(this.cursorIndex, 0, this.optionsLength)
        return null
      }
      if (this.cursorIndex === this.options.GAME) {
        this.inputOnGameOption()
      } else if (this.cursorIndex === this.options.SOUND) {
        this.inputOnSoundOption();
      }
      return null
    }
    inputIsAction() {
      if (!this.subOptions) {
        if (this.cursorIndex === this.options.GAME) {
          this.subCursorIndex = this.optionGame.DIFFICULTY
        } else if (this.cursorIndex === this.options.SOUND) {
          this.subCursorIndex = this.optionSound.BGM_CHOICE
        }
        this.subOptions = true
        return
      }
      if (this.cursorIndex === this.options.SOUND) {
        if (this.subCursorIndex === this.optionSound.BGM_CHOICE) {
          musicPlayer.playBgm(this.selectedMusic)
          return
        }
        if (this.subCursorIndex === this.optionSound.BGM_FORCED) {
          globalScene.musicForced = !globalScene.musicForced
          return
        }
      } else if (this.cursorIndex === this.options.GAME) {
        if (this.subCursorIndex === this.optionGame.DIFFICULTY) {
          this.optionDifficultyMult = updateIndexUpward(this.optionDifficultyMult, 1, 6)
          return
        }
      }
    }
    inputIsCancel() {
      if (!this.subOptions) return this.saveOptionGoToMenu()
      this.subOptions = false
      return null
    }
    inputOnSoundOption() {
      if (this.subCursorIndex === this.optionSound.BGM_CHOICE) {
        let currentBgmIndex = SND_BG_NAME_TO_INDEX[this.selectedMusic.NAME];
        currentBgmIndex = updateIndexX(currentBgmIndex, 0, SND_BG_KEYS.length - 1)
        this.selectedMusic = SND_Background[SND_BG_KEYS[currentBgmIndex]]
      }
      if (this.subCursorIndex === this.optionSound.BGM_CACHE) {
        musicPlayer.bgmMaxCache = updateIndexX(musicPlayer.bgmMaxCache, 0, 255)
      }
      this.subCursorIndex = updateIndexY(this.subCursorIndex, 0, this.optionsLengthSound)
    }
    inputOnGameOption() {
      if (this.subCursorIndex === this.optionGame.DIFFICULTY) {
        this.difficulty = updateIndexX(this.difficulty, 0, 1, 0.01 * (this.optionDifficultyMult ** 2))
        globalScene.difficulty = this.difficulty
      }
    }
    reset() {
      for (const k in this) {
        delete this[k]
      }
    }
}
export const optionScreen = new OptionScreen()