import { evaluateMove } from "../../data/ai.js"
import { TurnTimerMax, BaseItemIndex, TimerTopBottom, TimerLeftRight, AI_Best, AI_Strong, LevelCapAI, MapSize, TileEnemy, TilePlayer, TurnTimerMin, WaveContinue, WaveVictory, OutlineMedium, TextBig, TextMedium, TileMapWidth } from "../../data/data.js"
import { tileMap } from "../../data/tilemap.js"
import { SaveDataType } from "../../enums/savedata-type.js"
import { globalScene } from "../../global-scene.js"
import { input, Button } from "../../input-controller.js"
import { COLOR_BLACK, COLOR_ENEMY_OPAQUE, COLOR_PLAYER_OPAQUE, COLOR_WHITE_OPAQUE } from "../../utils/color.js"
import { deleteSave, doSave, getSave } from "../../utils/save.js"
import { drawText } from "../../utils/text.js"
import { AllScreens, ui } from "../ui.js"

class BattleScreen {
  setup(setSave) {
    if (setSave) getSave(this, SaveDataType.SESSION)
    this.setupBaseValues()
  }

  update() {
    this.phase = this.newPhase;
    switch (this.phase) {
      case this.phases.WAVE_START:
        this.updateWaveStart();
        break;
      case this.phases.TURN_CHOICE_PLAYER:
        this.updateTurnChoicePlayer();
        break;
      case this.phases.TURN_CHOICE_ENEMY:
        this.updateTurnChoiceEnemy();
        break;
      case this.phases.CHECK_PLAYER_VICTORY:
        this.updateCheckPlayerVictory();
        break;
      case this.phases.CHECK_ENEMY_VICTORY:
        this.updateCheckEnemyVictory();
        break;
      case this.phases.WAVE_END:
        this.updateWaveEnd();
        break;
      default:
    }
  }
  draw() {
    const player = this.turnPlayer;
    tileMap.draw(player, this.indexAction);
    const uiTextX = TileMapWidth + 4
    drawText(`TimeRemaining: ${this.turnChoiceFrames}`, uiTextX, 20, TextMedium, COLOR_WHITE_OPAQUE, OutlineMedium, COLOR_BLACK);
    drawText(`AverageTime: ${this.turnThinkFrameAverage.toFixed()}`, uiTextX, 40, TextMedium, COLOR_WHITE_OPAQUE, OutlineMedium, COLOR_BLACK);
    if (player) {
      drawText(`Player Turn`, uiTextX, 60, TextBig, COLOR_PLAYER_OPAQUE, OutlineMedium, COLOR_BLACK);
    } else {
      drawText(`Enemy Turn`, uiTextX, 60, TextBig, COLOR_ENEMY_OPAQUE, OutlineMedium, COLOR_BLACK);
    }
    drawText(`Wave: ${this.wave}`, uiTextX, 80, TextMedium, COLOR_WHITE_OPAQUE, OutlineMedium, COLOR_BLACK);
  }
  keyPressed() {
    if (this.phase !== this.phases.TURN_CHOICE_PLAYER) return null   
    let index = this.indexAction
    if (input.has(Button.RIGHT)) {
      let nextIndex = index + 1;
      while (nextIndex < MapSize && !tileMap.canSelect(nextIndex)) {
        nextIndex++;
      }
      if (nextIndex < MapSize) {
        index = nextIndex;
      }
    }
        
    if (input.has(Button.LEFT)) {
      let nextIndex = index - 1;
      while (nextIndex >= 0 && !tileMap.canSelect(nextIndex)) {
        nextIndex--;
      }
      if (nextIndex >= 0) {
        index = nextIndex;
      }
    }
        
    this.indexAction = index;
    if ((input.has(Button.ACTION))) {
      this.indexActionSelected = this.indexAction;
      this.indexActionSelectedLine = tileMap.changeTile(this.indexAction, TilePlayer);   
      this.newPhase = this.phases.CHECK_PLAYER_VICTORY
      return null               
    }
    return null
  }
  reset() {
    for (const i in this) {
      delete this[i]
    }
  }
  updateWaveStart() {
    this.waveTurnCount = 1;
    this.turnChoiceFramesMax = Math.max(TurnTimerMin, TurnTimerMax - this.wave)
    this.turnChoiceFrames = this.turnChoiceFramesMax
    tileMap.setup()
    this.waveCountMax = Math.max(this.waveCountMax, this.wave);
          
    //start the first turn of the new wave
    this.turnCountMin = Math.max(this.turnCount, this.turnCountMin);
    doSave(this, SaveDataType.SESSION)
    this.newPhase = this.turnPlayer ? this.phases.TURN_CHOICE_PLAYER : this.phases.TURN_CHOICE_ENEMY;
  }
  updateWaveEnd() {
    //remove all player and enemy items (with animation of them going down)
    this.newPhase = this.phases.WAVE_START;
  }
  updateTurnChoicePlayer() {
    //first we check this action index is playable, if not go right, note: base indexAction should be different based on player and enemy (save their last action)
    let index = this.indexAction;
    while (!tileMap.canSelect(index)) {
      index = (index + 1) % MapSize;
    }

    this.turnThinkFrameTotal++;
    this.indexAction = index;
    if (this.turnChoiceFrames-- <= 1) {
      this.indexActionSelected = this.indexAction;
      this.indexActionSelectedLine = tileMap.changeTile(this.indexAction, TilePlayer);
      this.newPhase = this.phases.CHECK_PLAYER_VICTORY;
      return null
    }
  }
  updateTurnChoiceEnemy() {
    //first check the score for each row
    let rand = 0;
    if (!this.indexActionSelected) {
      //check if AI should choose randomly
      const levelAI = this.wave * globalScene.difficulty;
      rand = (1 - Math.random()) * levelAI;
                        
      if (rand <= AI_Strong) this.indexAction = Math.floor(Math.random() * MapSize);
      //if not random check the score for each selectable row
      else {
        let indexScore = [];
        let lineIndex;
        for (let i = 0; i < MapSize; i++) {
        if (!tileMap.canSelect(i)) {
          indexScore.push(0);
          continue;
        }
        lineIndex = tileMap.changeTile(i, null);
        indexScore.push(evaluateMove(lineIndex, i, tileMap.tiles));
      }
        
      //now that scores are stored, we check if the AI should choose the highest score based on the wave
      if (rand > AI_Best) this.indexAction = indexScore.indexOf(Math.max(...indexScore));
        //if rand <= 100 then choose based on weight
        else if (rand > AI_Strong) {
          const weights = indexScore.map(score => Math.max(1, score));
          const totalWeight = weights.reduce((a, b) => a + b, 0);
          let random = Math.random() * totalWeight;
          let sum = 0;
          for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (random <= sum) {
              this.indexAction = i;
              break;
            }
          }
        }         
      }
        
      this.indexActionSelected = this.indexAction;
      this.indexActionSelectedLine = tileMap.changeTile(this.indexAction, TileEnemy);
      this.turnFinish = true;
    }
        
    if (this.turnFinish) {
      this.calculateTurnScore(rand)
      this.newPhase = this.phases.CHECK_ENEMY_VICTORY
    }
  }
  calculateTurnScore(iaValue) {
    const iaScore = Math.max(iaValue * 100, 1)
    this.waveTotalScore = this.waveTotalScore + iaScore
    this.waveScore = (this.waveTotalScore / this.waveTurnCount)
  }
  resetAction() {
    this.turnPlayer = !this.turnPlayer;
    this.turnFinish = false;
    this.turnCount++;
    this.turnChoiceFrames = this.turnChoiceFramesMax;
    this.indexAction = BaseItemIndex; //change this later
    this.indexActionCurrent = BaseItemIndex;
    this.indexActionSelected = null;
  }
  updateCheckPlayerVictory() {
    //check if player won, if not start enemy turn
    //Also check draw, if there is a draw then start the wave again basically same as next wave but not increasing wave count
    this.turnResult = tileMap.checkVictory(this.indexActionSelectedLine, this.indexActionSelected);
  
    this.resetAction();
    this.turnThinkFrameAverage = this.turnThinkFrameTotal / this.turnCount;
    console.log('turnResult', this.turnResult);
    if (this.turnResult === WaveContinue) {
      this.newPhase = this.phases.TURN_CHOICE_ENEMY;
    } else if (this.turnResult === WaveVictory) {
      this.wave++; 
      this.newPhase = this.phases.WAVE_END; 
    } else {
      this.newPhase = this.phases.WAVE_END;
    }
  }
  updateCheckEnemyVictory() {
    //check if enemy won, if not start player turn, note: until the AI is made the turnResult will be WaveVictory
    this.turnResult = tileMap.checkVictory(this.indexActionSelectedLine, this.indexActionSelected);
    this.resetAction();
    console.log('turnResult', this.turnResult);
    if (this.turnResult === WaveContinue) {
      this.newPhase = this.phases.TURN_CHOICE_PLAYER;
    } else if (this.turnResult === WaveVictory) {
      deleteSave(SaveDataType.SESSION) 
      ui.goToScreen(AllScreens.TITLE)
    } else {
      this.newPhase = this.phases.WAVE_END;
    }
  }
  setupBaseValues() {
    this.phases = {
      WAVE_START: 0,
      TURN_CHOICE_PLAYER: 1,
      CHECK_PLAYER_VICTORY: 3,
      TURN_CHOICE_ENEMY: 4,
      CHECK_ENEMY_VICTORY: 6,
      PLAYER_VICTORY: 7,
      ENEMY_VICTORY: 8,
      WAVE_END: 9
    };
    this.phase = this.phases.WAVE_START
    this.newPhase = this.phases.WAVE_START
    this.difficulty = this.difficulty ?? 0
    this.wave = this.wave ?? 0
    this.waveMax = this.waveMax ?? 0
    this.totalTurnCount = this.totalTurnCount ?? 0
    this.turnPlayer = this.turnPlayer ?? true
    this.score = this.score ?? 0
    this.waveTurnCount = this.waveTurnCount ?? 0
    this.turnCount =  this.turnCount ?? 0
    this.turnCountPlayer = this.turnCountPlayer ?? 1
    this.turnThinkFrameTotal = this.turnThinkFrameTotal ?? 0
    this.turnThinkFrameAverage = this.turnThinkFrameAverage ?? 0
    this.turnChoiceFramesMax = this.turnChoiceFramesMax ?? TurnTimerMax
    this.turnChoiceFrames = TurnTimerMax
    this.turnCountMin = null
    this.indexActionCurrent = BaseItemIndex
    this.indexAction = BaseItemIndex
    this.indexActionSelected = null
    this.indexActionSelectedLine = null
    this.turnFinish = false
    this.timerTopBottom = TimerTopBottom
    this.timerLeftRight = TimerLeftRight
    this.turnResult = null
  }
}
export const battleScreen = new BattleScreen()