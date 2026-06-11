
import { COLOR_ENEMY_OPAQUE, COLOR_PLAYER_OPAQUE, COLOR_PLAYER, COLOR_STROKE_ENEMY, COLOR_STROKE_PLAYER, COLOR_BLUE, COLOR_ENEMY, COLOR_STROKE_PLAYER_OPAQUE, COLOR_STROKE_ENEMY_OPAQUE } from "../utils/color.js";
import { drawBox, drawCircle, setDrawData } from "../utils/draw.js";
import { MapSize, OutlineMedium, TileEmpty, TileEnemy, TileMapDirections, TilePlayer, TileSize, TileTop, WaveContinue, WaveDraw, WaveVictory, PlayerRadius, TileSizeHalf } from "./data.js";

//Need a resize
//Also store data that do not change
class TileMap {
    setup() {
        this.tiles = new Array(MapSize * MapSize)
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i] = i < MapSize ? TileTop : TileEmpty;
        }
    }
    getTile(x, y) {
        if (x < 0 || x >= MapSize || y < 0 || y >= MapSize) return null;
        return this.tiles[y * MapSize + x];
    }
    changeTile(row, newTile) {
        for (let line = MapSize; line > 0; line--) {
            const index = line * MapSize + row;
            if (this.tiles[index] !== TileEmpty) continue;
            console.log("found", this.tiles, this.tiles[index], line, row);
            if (newTile !== null) this.tiles[index] = newTile; 
            return line; //return the line to get the last play to check for victory
        }
        console.log("unfound", row, newTile, this.tiles)
    }
    canSelect(row) {
        const index = 1 * MapSize + row;
        return this.tiles[index] === TileEmpty;
    }
    checkVictory(lastRow, lastCol) {
        const tiles = this.tiles;
        const player = tiles[lastRow * MapSize + lastCol];

        for (const [dy, dx] of TileMapDirections) {
            let count = 1;
            for (let dir = -1; dir <= 1; dir += 2) {
                let y = lastRow + dir * dy;
                let x = lastCol + dir * dx;

                while (
                    x >= 0 && x < MapSize &&
                    y >= 0 && y < MapSize &&
                    tiles[y * MapSize + x] === player
                ) {
                   count++;
                   y += dir * dy;
                   x += dir * dx;
                }
            }

            if (count >= 4) return WaveVictory;
        }

        //if no power4, then check if there is still space on the topmost row
        let selectable = 0;
        for (let i = 0; i < MapSize; i++) {
            if (this.canSelect(i)) {
                selectable++;
            }
        }
        if (selectable === 0) return WaveDraw;
        return WaveContinue;
    }
    draw(player, indexAction) {
        //draw piece to the screen
        const itemColor = player ? COLOR_PLAYER_OPAQUE : COLOR_ENEMY_OPAQUE;
        const itemStroke = player ? COLOR_STROKE_PLAYER_OPAQUE : COLOR_STROKE_ENEMY_OPAQUE;
        drawBox(0, TileSize, MapSize * TileSize, MapSize * TileSize, COLOR_BLUE); //grid propriety
        
        //this will get the position of each players piece and change color based on player and enemy
        for (let j = 1; j < MapSize; j++) {
            for (let i = 0; i < MapSize; i++) {
                if (this.getTile(i, j) === TilePlayer) {//Yellow
                    drawCircle(i * TileSize + TileSizeHalf, j * TileSize + TileSizeHalf, PlayerRadius, COLOR_PLAYER, COLOR_STROKE_PLAYER, OutlineMedium);
                    continue;
                }
                if (this.getTile(i, j) === TileEnemy) {
                    //Red
                    drawCircle(i * TileSize + TileSizeHalf, j * TileSize + TileSizeHalf, PlayerRadius, COLOR_ENEMY, COLOR_STROKE_ENEMY, OutlineMedium);
                    continue;
                }
            }
        }
        drawCircle(indexAction * TileSize + TileSizeHalf, TileSizeHalf, PlayerRadius, itemColor, itemStroke, OutlineMedium);
    }
}
export const tileMap = new TileMap()