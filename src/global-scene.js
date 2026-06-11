import { SND_Background } from "./constant/sound/bgm.js";
import { SaveDataType } from "./enums/savedata-type.js";
import { musicPlayer } from "./music.js";
import { SpriteObject } from "./objects.js";
import { ui } from "./ui/ui.js";
import { getSave } from "./utils/save.js";

class GlobalScene {
    isPaused = false
    constructor() {}
    setupBaseValues() {
      this.difficulty = this.difficulty ?? 0
      this.musicForced = this.musicForced ?? false
      this.musicBg = this.musicForced ? this.musicBg ?? SND_Background.END : SND_Background.END
    }
    //stay async untll i know if i need to wait for music
    async setup() {
      getSave(this, SaveDataType.SETTINGS)
      this.setupBaseValues()

      musicPlayer.setup()
      //should it be await? It works without being it but idk
      musicPlayer.playBgm(this.musicBg);
      ui.setupTitleScreen()
    }
    update() {
      ui.update()
    }
    draw() {
      ui.draw()
    }
    keyPressed() {
      ui.keyPressed()
    }
}

export const globalScene = new GlobalScene();