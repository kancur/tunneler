import GameMap from "./GameMap";

export default class MapGenerator {
  constructor(width, height, seed = null) {
    this.width = width;
    this.height = height;
    this.seed = seed;
  }

  generate() {
    const map = new GameMap();
    /* for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        map.setTile(x, y, Math.floor(Math.random() * 4));
      };
    } */
    console.log(map);
    console.info("size in bytes",(new Blob([JSON.stringify(map.tiles)]).size) * 0.000001); // 38

    return map;
  }
}
