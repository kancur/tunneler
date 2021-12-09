// 1200 * 600

import Explosion from '../player/Explosion';

// 0 === stone
// 1 && 2 === ground
// 3 === empty cell
// 4 === tank tracks blue
// 5 === tank body blue
// 6 === barel tank blue
// 7 === tank tracks green
// 8 === tank body green
// 9 === barel tank green
// 10 === projectile light
// 11 === projectile dark
// 12 === blue base
// 13 === green base

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
    this.tiles = [];
    this.tiles.length = width * height;
    this.tiles.fill(0);
    this.tiles = this.tiles.map(() => (Math.random() > 0.5 ? 1 : 2));
    this.generateStoneBorders();
    this.tiles = Uint8Array.from(this.tiles);
    this.prevTankTiles = [];
    this.activeTank = null;
    this.activeProjectiles = new Map();
    this.activeExplosions = new Map();
    this.bases = [];
  }

  addBase(base) {
    this.bases.push(base);
    this.renderBasesToMap();
  }

  addTank(tank) {
    this.activeTank = tank;
  }

  pushProjectile(projectile) {
    this.activeProjectiles.set(projectile.hash, projectile);
  }

  logTiles() {
    console.log('tiles:', this.tiles);
  }

  isDirt(x, y, x2, y2) {}

  getTile(x, y) {
    if (x >= this.width) return 0;
    if (x < 0) return 0;
    if (y >= this.height) return 0;
    if (y < 0) return 0;
    return this.tiles[y * this.width + x];
  }

  isInBounds(x, y) {
    if (x > this.width - 1 || x < 0) {
      return false;
    }
    if (y > this.height - 1 || y < 0) {
      return false;
    }
    return true;
  }

  setTile(x, y, type) {
    if (x >= this.width) throw Error(`Trying to set a tile out of bounds (x >= width) x --> ${x}`);
    if (x < 0) throw Error(`Trying to set a tile out of bounds (x < 0) x --> ${x}`);
    if (y >= this.height)
      throw Error(`Trying to set a tile out of bounds (y >= height) y --> ${y}`);
    if (y < 0) throw Error(`Trying to set a tile out of bounds (y < 0) y --> ${y}`);
    this.tiles[y * this.width + x] = type;
  }

  clearMapBeforeRender() {
    // could be optimized by not iterating the whole map if needed
    this.tiles = this.tiles.map((x) => {
      if (x >= 4 && x <= 9) {
        return 3;
      }
      if (x === 10 || x === 11) {
        return 3;
      }
      return x;
    });
  }

  renderBasesToMap() {
    this.bases.forEach((base) => {
      for (let x = 0; x < base.width; x++) {
        for (let y = 0; y < base.height; y++) {
          const baseTile = base.getTile(x, y);
          if (baseTile !== 2){
            this.setTile(x + base.x, y + base.y, baseTile === 0 ? 3 : base.colorCode);
          }
        }
      }
    });
  }

  renderExplosionsToMap() {
    this.activeExplosions.forEach((explosion) => {
      explosion.particles.forEach((particle) => {
        const currentTile = this.getTile(particle.x, particle.y);
        if (currentTile > 0 && currentTile < 4) {
          this.setTile(particle.x, particle.y, 10);
        }
      });
    });
  }

  renderProjectilesToMap() {
    this.activeProjectiles.forEach((projectile) => {
      if (!this.isInBounds(projectile.x, projectile.y)) return;

      this.setTile(projectile.x, projectile.y, 10);
      this.setTile(projectile.tailX, projectile.tailY, 11);
    });
  }

  renderTankToMap() {
    for (let x = 0; x < this.activeTank.width; x++) {
      for (let y = 0; y < this.activeTank.height; y++) {
        const tankTile = this.activeTank.getTile(x, y);
        if (tankTile !== 0) {
          this.setTile(x + this.activeTank.x, y + this.activeTank.y, tankTile);
        } else {
          //this.setTile(x + tank.x, y + tank.y, 3);
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

  update() {
    this.clearMapBeforeRender();
    this.renderTankToMap();

    // active explosions / particles
    this.activeExplosions.forEach((explosion) => {
      explosion.particles.forEach((particle) => {
        particle.update();
        const underlyingTile = this.getTile(particle.x, particle.y);
        if (underlyingTile === 12 || underlyingTile === 13) {
          explosion.particles.delete(particle.hash);
        }
        if (particle.life === 0) {
          explosion.particles.delete(particle.hash);
        }
        if (!this.isInBounds(particle.x, particle.y)) {
          explosion.particles.delete(particle.hash);
        }
      });
    });

    // active projectiles
    this.activeProjectiles.forEach((projectile) => {
      projectile.update();

      // this iterates over hypothetical future path of the projectile
      // done to handle sub single frame/gameupdate collisions
      for (let i = 0; i < projectile.futurePath.length; i++) {
        const coords = projectile.futurePath[i];
        // prev coords are coordinates of the trailing pixel behind the projectile
        const prevCoords = {
          x: coords.x + projectile.vector2.x * -1,
          y: coords.y + projectile.vector2.y * -1,
        };
        const tile = this.getTile(coords.x, coords.y);
        if (tile < 3 || tile === 12 || tile === 13) {
          this.activeProjectiles.delete(projectile.hash);
          let explosionVector = { x: 0, y: 0 };
          
          /* if (tile !== 1 && tile !== 2) {
            explosionVector = { x: projectile.vector2.x * -1, y: projectile.vector2.y * -1 };
          }  */
          const explosion = new Explosion(prevCoords.x, prevCoords.y, explosionVector, 6);
          this.activeExplosions.set(explosion.hash, explosion);
          break;
        }
      }
    });

    this.renderProjectilesToMap();
    this.renderExplosionsToMap();
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
