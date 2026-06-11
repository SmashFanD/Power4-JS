import { CTX } from "./gameloop.js";
import { translateColor } from "./utils/color.js";
import { getTextHeight, getTextWidth } from "./utils/common.js";
import { getRealPosition } from "./utils/objects.js";
import { drawText } from "./utils/text.js";
export class SpriteObject {
    constructor(
        image,
        x = 0,
        y = 0,
        width = 0,
        height = 0
    ) {
        this.image = new Image();
        this.image.src = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scaleX = 1
        this.scaleY = 1
        this.visible = true
        this.originX = 0
        this.originY = 0
    }
    setScale(scaleX, scaleY = this.scaleY) {
        this.scaleX = scaleX ?? this.scaleX
        this.scaleY = scaleY
        return this
    }
    setVisible(visible = !this.visible) {
        this.visible = visible
        return this
    }
    setOrigin(x = 0, y = this.originY) {
        this.originX = x;
        this.originY = y;
        return this
    }
    draw(
        x = this.x,
        y = this.y,
        width = this.width,
        height = this.height
    ) {
        if (!this.visible) return
        const sizeX = width * this.scaleX
        const sizeY = height * this.scaleY
        CTX.drawImage(
            this.image,
            getRealPosition(x, this.originX, sizeX),
            getRealPosition(y, this.originY, sizeY),
            sizeX, sizeY
        );
    }
}
export class TextObject {
    constructor(
        text = "",
        x = 0,
        y = 0,
        textSize,
    ) {
        this.text = text
        this.x = x;
        this.y = y;
        this.textSize = textSize;
        this.scale = 1
        this.visible = true
        this.originX = 0
        this.originY = 0
    }
    setScale(scale = this.scale) {
        this.scale = scale ?? this.scale
        return this
    }
    setVisible(visible = !this.visible) {
        this.visible = visible
        return this
    }
    setOrigin(x = 0, y = this.originY) {
        this.originX = x;
        this.originY = y;
        return this
    }
    draw(
        text = this.text,
        x = this.x,
        y = this.y,
        size = this.textSize
    ) {
        if (!this.visible) return
        const textSize = size * this.scale
        const originOffsetY = this.originY + 1
        const sizeX = getTextWidth(textSize, text.length)
        const sizeY = getTextHeight(textSize)
        drawText(
            text,
            getRealPosition(x, this.originX, sizeX),
            getRealPosition(y, originOffsetY, sizeY),
            textSize
        );
    }
}
export class RectangleObject {
    constructor(
        x = 0, y = 0, width, height,
        fillColor, strokeColor, strokeWidth
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.visible = true
        this.originX = 0;
        this.originY = 0;
        this.alpha = 1;
        this.strokeAlpha = 1
    }
    setSize(width, height = this.height) {
        this.width = width ?? this.width
        this.height = height
        return this
    }
    setDrawData(fillColor, fillAlpha = this.alpha, strokeColor = this.strokeColor, strokeSize = this.strokeWidth, strokeAlpha = this.strokeAlpha) {
        this.fillColor = fillColor ?? this.fillColor
        this.alpha = fillAlpha
        this.strokeColor = strokeColor
        this.strokeWidth = strokeSize
        this.strokeAlpha = strokeAlpha
        return this
    }
    setVisible(visible = !this.visible) {
        this.visible = visible
        return this
    }
    
    setOrigin(x, y = this.originY) {
        this.originX = x ?? this.originX;
        this.originY = y;
        return this
    }
    setStrokeSize(size) {
        this.strokeWidth = size
        return this
    }
    setFillAlpha(alpha) {
        this.alpha = alpha
        return this
    }
    setStrokeAlpha(alpha) {
        this.strokeAlpha = alpha
        return this
    }
    setAlpha(alpha, strokeAlpha = alpha) {
        this.strokeAlpha = strokeAlpha
        this.alpha = alpha;
        return this
    }
    draw() {
        if (!this.visible) return
        const x = this.x + this.originX * this.width
        const y = this.y + this.originY * this.height
        const x2 = x + this.width
        const y2 = y + this.height
        CTX.fillStyle = translateColor(this.fillColor, this.alpha);;
        CTX.fillRect(x, y, x2, y2);
        CTX.lineWidth = this.strokeWidth;
        CTX.strokeStyle = translateColor(this.strokeColor, this.alpha);;
        CTX.lineWidth = this.strokeWidth;
        CTX.strokeRect(x, y, x2, y2);
    }
}
export class ContainerObject {
    constructor(
        x = 0, y = 0
    ) {
        this.x = x;
        this.y = y;
        this.originX = 0;
        this.originY = 0;
        this.childs = []
    }
    setScale(scaleX, scaleY = this.scaleY) {
        this.scaleX = scaleX ?? this.scaleX
        this.scaleY = scaleY
        return this
    }
    addPosition(x, y = 0) {
        this.x += x
        this.y += y
        return this
    }
    remove(child) {
        const index = this.childs.indexOf(child);
        if (index !== -1) {
            this.childs.splice(index, 1);
        }
    }
    removeAll() {
        this.childs.length = 0;
    }
    setX(x) {
        this.x = x
        return this
    }
    add(childs) {
        console.log(childs)
        if (Array.isArray(childs)) {
            for (const child of childs) {
              this.childs.push(child)
            }
        } else this.childs.push(childs)
        return this
    }
    setVisible(visible) {
        for (const child of this.childs) {
            child?.setDepth(visible)
        }
        return this
    }
    drawAbove(target) {
        const newDepth = target.depth + 1
        for (const child of this.childs) {
            child?.setDepth(newDepth)
        }
        return this
    }
    setDepth(depth = 0) {
        for (const child of this.childs) {
            child?.setDepth(depth)
        }
        return this
    }
    draw() {
        for (const child of this.childs) {
            child?.draw(this.scaleX, this.scaleY, this.x, this.y)
        }
    }
    setName(name) {
        this.name = name
        return this
    }
}