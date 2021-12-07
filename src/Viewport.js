// original game 72px * 76px visible map per player

export default class Viewport {
  constructor(gameMap, width, height) {
    this.gameMap = gameMap;
    this.view = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = 72; // must be a pair number
    this.height = 76; // must be a pair number
    this.update(0, 0);
  }

  update(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    //this.view = [];
/*     for (let y = offsetY; y < this.height + offsetY; y++) {
      for (let x = offsetX; x < this.width + offsetX; x++) {
        const tile = this.gameMap.getTile(x, y);
        this.view.push(tile);
      }
    } */
  }

  getTile(x, y) {
    return this.gameMap.getTile(x + this.offsetX, y + this.offsetY);
    //return this.view[y * this.width + x];
  }
}
