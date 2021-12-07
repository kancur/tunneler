// 1200 * 600

// 0 === stone
// 1 && 2 === ground
// 3 === empty cell
// 4 === tank tracks
// 5 === tank body
// 6 === barel

export default class GameMap {
  constructor(width = 1200, height = 600) {
    this.settings = {
      border: {
        maxDepth: 50,
        maxEdgeLength: 10,
        maxSteepness: 4,
      },
    };
    this.width = width;
    this.height = height;
    // consider Uint8Array
    this.tiles = [];
    this.tiles.length = width * height;
    this.tiles.fill(0);
    this.tiles = this.tiles.map(() => (Math.random() > 0.5 ? 1 : 2));
    this.generateStoneBorders();
    this.tiles = Uint8Array.from(this.tiles);
  }

  logTiles() {
    console.log("tiles:", this.tiles);
  }

  getTile(x, y) {
    if (x >= this.width) return 0;
    if (x < 0) return 0;
    if (y >= this.height) return 0;
    if (y < 0) return 0;
    return this.tiles[y * this.width + x];
  }

  setTile(x, y, type) {
    if (x >= this.width) throw Error;
    if (x < 0) throw Error;
    if (y >= this.height) throw Error;
    if (y < 0) throw Error;
    this.tiles[y * this.width + x] = type;
  }

  renderTank(tank) {
    for (let x = 0; x < tank.width; x++) {
      for (let y = 0; y < tank.height; y++) {
        const tankTile = tank.getTile(x, y);
        /* if (tankTile === 99) {
          this.setTile(x + tank.x, y + tank.y, 3);
        } */
        if (tankTile !== 0) {
          this.setTile(x + tank.x, y + tank.y, tankTile);
        } else {
          this.setTile(x + tank.x, y + tank.y, 3);
        }
      }
    }
  }

  generateStoneBorders() {
    const { maxDepth } = this.settings.border;
    const left = this.generateForOneSide(this.height, maxDepth);
    const right = this.generateForOneSide(this.height, maxDepth);
    const top = this.generateForOneSide(this.width, maxDepth);
    const bottom = this.generateForOneSide(this.width, maxDepth);

    for (let y = 0; y < this.height; y++) {
      // left
      for (let x = 0; x < maxDepth; x++) {
        const newTileVal = left[y * maxDepth + x];
        if (newTileVal === 0) {
          this.setTile(x, y, 0);
        }
      }

      // right
      for (let x = maxDepth; x > 0; x--) {
        const newTileVal = right[y * maxDepth + x - 1];
        if (newTileVal === 0) {
          this.setTile(this.width - x, y, 0);
        }
      }
    }

    for (let x = 0; x < this.width; x++) {
      // top
      for (let y = 0; y < maxDepth; y++) {
        const newTileVal = top[x * maxDepth + y];
        if (newTileVal === 0) {
          this.setTile(x, y, 0);
        }
      }

      // bottom
      for (let y = maxDepth; y > 0; y--) {
        const newTileVal = bottom[x * maxDepth + y - 1];
        if (newTileVal === 0) {
          this.setTile(x, this.height - y, 0);
        }
      }
    }
  }

  generateForOneSide(edgeLength, maxDepth) {
    const { maxEdgeLength, maxSteepness } = this.settings.border;

    let willKeepDirectionFor = getDirectionLength(maxEdgeLength);
    let currentMaxSteepness = getCurrentMaxSteepness(maxSteepness);
    let currentDistance = 10;
    let grow = true;
    let currentChange = 0;
    const array = [];
    array.length = edgeLength * maxDepth;
    array.fill(1);

    const setLocalTile = (x, y, type) => {
      array[y * maxDepth + x] = type;
    };

    for (let col = 0; col < edgeLength; col++) {
      if (willKeepDirectionFor <= 0) {
        //grow = !grow;
        grow = Math.random() < 0.5;
        currentMaxSteepness = getCurrentMaxSteepness(maxSteepness);
        willKeepDirectionFor = getDirectionLength(maxEdgeLength);
      }

      if (grow) {
        currentChange = getChange(currentMaxSteepness);
      } else {
        currentChange = -getChange(currentMaxSteepness);
      }

      currentDistance += currentChange;
      willKeepDirectionFor -= 1;

      if (currentDistance >= maxDepth) {
        currentDistance = maxDepth;
        willKeepDirectionFor = 0;
      } else if (currentDistance <= 0) {
        currentDistance = 0;
        willKeepDirectionFor = 0;
      }

      for (let row = 0; row < maxDepth; row++) {
        if (row < currentDistance) {
          setLocalTile(row, col, 0);
        }
      }
    }
    return array;
  }
}

const getDirectionLength = (maxLength) => {
  return Math.floor(Math.random() * maxLength);
};

const getChange = (maxSteepness) => {
  return Math.random() * maxSteepness;
};

const getCurrentMaxSteepness = (maxSteepness) => {
  return Math.floor(Math.random() * maxSteepness) + 1;
};
