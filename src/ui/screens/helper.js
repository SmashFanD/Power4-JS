import { getTextHeight, getTextWidth, CANVAS_HEIGHT, CANVAS_WIDTH } from "../../utils/common.js"


export function mapOptionsKeys(baseObject) {
  let newObjectItem = {...baseObject}
  let newObjectId = -1
  for (const i in newObjectItem) {
    newObjectId++
    newObjectItem[i] = newObjectId
  }
  return {
    newObjectItem,
    newObjectId
  }
}

export function createTextMenuX(
    texts, 
    withCursor = true,
    baseX = 0,
    baseY = 0,
    textSize = 0,
    spacing = 0,
    reverseX = false,
    reverseY = false,
    boxOutlineSize = 0,
    textOutlineSize = 0
) {
  const padding = textOutlineSize + boxOutlineSize

  const textHeights = getTextHeight(textSize)
  const cursorSize = withCursor ? textHeights * 0.7 : 0
  const cursorOffsetX = withCursor ? cursorSize + padding : 0
  let maxTextWidth = 0
  let optionLength = -1
  for (const key in texts) {
    optionLength++
    maxTextWidth = Math.max(maxTextWidth, getTextWidth(textSize, texts[key].length))
  }

  const spaceMult = spacing * optionLength
  const paddingMult = padding * optionLength

  const firstTextHeight = Math.ceil(textHeights + padding)
  const maxSizeTextY = Math.ceil(((optionLength) * textHeights) + firstTextHeight + spaceMult + paddingMult)
  const maxSizeTextX = Math.ceil(maxTextWidth + padding)

  const textLeftX = reverseX ? baseX - (maxSizeTextX) : baseX + padding + cursorOffsetX
  const cursorMaxX = textLeftX - cursorOffsetX
  const textTopY = reverseY ? baseY - (maxSizeTextY + padding) : baseY + maxSizeTextY

  const boxStartX = reverseX ? cursorMaxX - padding : baseX
  const boxWidth = Math.abs((reverseX ? baseX : (baseX + textLeftX + maxSizeTextX)) - boxStartX)
  const boxStartY = reverseY ? textTopY : baseY
  const boxHeight = Math.abs((reverseY ? baseY : textTopY + padding) - boxStartY)

  const textDataY = {}
  /** @type {Object.<string, number>} */
  const cursorY = {}
  const textBaseY = boxStartY + padding + textHeights
  for (let i = 0; i <= optionLength; ++i) {
    const thisY = textBaseY + i * textHeights + spacing * i + padding * i
    textDataY[i] = thisY;
    cursorY[i] = thisY - cursorSize * 0.5 - textHeights * 0.5 + 2
    console.log(i, textDataY[i], cursorY[i])
  }

  if (!withCursor) {
    return {
      textDataX: textLeftX,
      textDataY,
      boxDataX: boxStartX,
      boxDataY: boxStartY,
      boxDataSizeX: boxWidth,
      boxDataSizeY: boxHeight,
    }
  }
  return {
    textDataX: textLeftX,
    textDataY,
    cursorDataX: cursorMaxX,
    cursorDataY: cursorY,
    cursorDataSize: cursorSize,
    boxDataX: boxStartX,
    boxDataY: boxStartY,
    boxDataSizeX: boxWidth,
    boxDataSizeY: boxHeight,
  }
}

export function createTextNoMenuX(
    texts, 
    withCursor = true,
    baseX = 0,
    baseY = 0,
    textSize = 0,
    spacing = 0,
    reverseX = false,
    reverseY = false,
    textOutlineSize = 0
) {
  const paddingX = 2
  const paddingY = textOutlineSize * 0.5 + 2

  let maxTextWidth = 0
  let optionLength = 0
  for (const key in texts) {
    optionLength++
    maxTextWidth = Math.max(maxTextWidth, getTextWidth(textSize, texts[key].length))
  }

  const textHeights = getTextHeight(textSize)
  const cursorSize = withCursor ? textHeights * 0.7 : 0
  const cursorOffsetX = withCursor ? cursorSize + paddingX : 0
  const maxSizeTextX = Math.ceil(maxTextWidth + paddingX)
  const textLeftX = reverseX ? baseX - (maxSizeTextX) : baseX + paddingX + cursorOffsetX
  const cursorMaxX = textLeftX - cursorOffsetX

  const textWithSpacing = textHeights + spacing + paddingY
  const textTotalSpace = Math.ceil(textWithSpacing * optionLength)
  const textTopY = reverseY ? baseY - (textTotalSpace) : baseY + textTotalSpace

  const boxStartY = reverseY ? textTopY : baseY
  const boxHeight = Math.abs((reverseY ? baseY : textTopY + paddingY) - boxStartY)

  const textDataY = {...texts}
  /** @type {Object.<string, number>} */
  const cursorY = {}
  const halfTextHeight = textHeights * 0.5
  for (let i = 0; i < optionLength; ++i) {
    const thisY = boxStartY + (i + 1) / (optionLength + 1) * boxHeight + halfTextHeight - 3;
    textDataY[i] = thisY;
    cursorY[i] = thisY - textHeights * 0.85 + 5;
  }

  if (!withCursor) {
    return {
      textDataX: textLeftX,
      textDataY
    }
  }
  return {
    textDataX: textLeftX,
    textDataY,
    cursorDataX: cursorMaxX,
    cursorDataY: cursorY,
    cursorDataSize: cursorSize,
  }
}