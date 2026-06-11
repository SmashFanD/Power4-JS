import { SaveDataType } from "../enums/savedata-type.js";

export function getSave(instance, saveType) {
  let data = ""
  if (saveType === SaveDataType.SESSION) {
    data = localStorage.getItem(`PowerFourSession`);
    if (data) {
      const assignData = JSON.parse(data)
      console.log("gettingSaveSession", instance, saveType, assignData)
      return !!Object.assign(instance, assignData);
    }
  }
  if (saveType === SaveDataType.SETTINGS) {
    data = localStorage.getItem('PowerFourSettings');
    if (data) {
      const assignData = JSON.parse(data)
      console.log("gettingSaveSettings", instance, saveType, assignData)
      return !!Object.assign(instance, assignData);
    }
  }
  
  console.log("noSaveFound", instance, saveType)
  return false
}
export function doSave(type, saveType) {
  /** 
   * @type {{
   *  [key: string]: any
   * }}
   */
  const data = {}
  if (!saveType || saveType === SaveDataType.SESSION){
    data.wave = type.wave
    data.waveMax = type.waveMax
    data.totalTurnCount = type.totalTurnCount
    data.score = type.score
    data.turnPlayer = type.turnPlayer
    localStorage.setItem(`PowerFourSession`, JSON.stringify(data));
  }
  if (!saveType || saveType === SaveDataType.SETTINGS) {
    data.musicBg = type.musicBg;
    data.musicForced = type.musicForced;
    data.difficulty = type.difficulty
    localStorage.setItem('PowerFourSettings', JSON.stringify(data));
  }
}
export function deleteSave(saveType) {
  if (!saveType || saveType === SaveDataType.SESSION){
    localStorage.removeItem('PowerFourSession')
  }
  if (!saveType || saveType === SaveDataType.SETTINGS) {
    localStorage.removeItem('PowerFourSettings')
  }
}