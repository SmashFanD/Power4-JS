import { SND_Background } from "../constant/sound/bgm.js";

export const SND_BG_KEYS = Object.keys(SND_Background)
export const SND_BG_VALUES = referenceObject(SND_Background)
function referenceObject(object, start = 0) {
    const newRef = {}
    let i = start - 1
    for (const o in object) {
      i++
      newRef[i] = o
    }
    return newRef
}

export const SND_BG_NAME_TO_INDEX = getNameToIndex(SND_Background)
function getNameToIndex(set) {
  const map = {};
  Object.keys(set).forEach((key, i) => {
    map[set[key].NAME] = i;
  });
  return map;
}
