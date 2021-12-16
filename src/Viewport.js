// original game 72px * 76px visible map per player

export default class Viewport {
  constructor(gameMap, width, height) {
    this.gameMap = gameMap;
    this.view = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = 76; // must be a pair number
    this.height = 71; // must be a pair number
    this.update(0, 0);
  }

  update(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  getTile(x, y) {
    return this.gameMap.getTile(x + this.offsetX, y + this.offsetY);
  }
}
