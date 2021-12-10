// 1200 * 600 map size probably default
import { SeededRNG } from '../Helpers';
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

export const IMPENETRABLES = [0, 4, 5, 6, 7, 8, 9, 12, 13];
export const PROJECTILE_BLOCKERS = [...IMPENETRABLES, 1, 2];
export const PROJECTILE_BLOCKERS_EXCEPT_TANKS = [0, 1, 2, 12, 13];
export const IMPENETRABLES_EXCEPT_TANKS = [0, 12, 13];

export default class GameMap {
  constructor(width = 1200, height = 600, seed = 1) {
    this.settings = {
      border: {
        maxDepth: 50,
        maxEdgeLength: 10,
        maxSteepness: 4,
      },
    };
    this.seed = seed;
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.tiles.length = width * height;
    this.tiles.fill(0);
    this.tiles = this.tiles.map((code) => {
      if (code === 0) return Math.random() > 0.5 ? 1 : 2;
    });
    this.generateStoneBorders(); 
    this.tiles = Uint8Array.from(this.tiles);
    this.prevTankTiles = [];
    this.activeTank = null;
    this.activeProjectiles = new Map();
    this.activeExplosions = new Map();
    this.bases = [];

    this.init();
  }

  init() {
    this.sendDataToServer();
  }

  sendDataToServer() {
    const gameMap = {
      seed: this.seed,
      width: this.width,
      height: this.height,
      settings: this.settings,
   }
  }

  logSize() {
    const json = JSON.stringify(this.tiles);
    const size = new TextEncoder().encode(json).length;
    const kiloBytes = size / 1024;
    console.log(`Map size: ${kiloBytes} KB`);
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
          if (baseTile !== 2) {
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
    const { maxDepth, maxEdgeLength, maxSteepness } = this.settings.border;
    const left = this.generateForOneSide(this.height, maxDepth, maxEdgeLength, maxSteepness, this.seed);
    const right = this.generateForOneSide(this.height, maxDepth, maxEdgeLength, maxSteepness, this.seed + 10);
    const top = this.generateForOneSide(this.width, maxDepth, maxEdgeLength, maxSteepness, this.seed + 22);
    const bottom = this.generateForOneSide(this.width, maxDepth, maxEdgeLength, maxSteepness, this.seed + 35);

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

  generateForOneSide(edgeLength, maxDepth, maxEdgeLength, maxSteepness, seed) {
    const seededRNG = new SeededRNG(seed);
    let willKeepDirectionFor = 0; 
    let currentMaxSteepness = 0;
    let currentDistance = 50;
    let grow = true;
    let currentChange = 0;
    const array = [];
    array.length = edgeLength * maxDepth;
    array.fill(1); // 1 will be ignored, 0 will be stone

    const setLocalTile = (x, y, type) => {
      array[y * maxDepth + x] = type;
    };

    const getDirectionLength = (maxLength, random) => {
      return Math.floor(random * maxLength);
    };
    
    const getChange = (maxSteepness, random) => {
      return random * maxSteepness;
    };
    
    const getCurrentMaxSteepness = (maxSteepness, random) => {
      return Math.floor(random * maxSteepness) + 1;
    };

    for (let col = 0; col < edgeLength; col++) {
      if (willKeepDirectionFor <= 0) {
        //grow = !grow;
        grow = seededRNG.get() < 0.5;
        currentMaxSteepness = getCurrentMaxSteepness(maxSteepness, seededRNG.get());
        willKeepDirectionFor = getDirectionLength(maxEdgeLength, seededRNG.get());
      }

      if (grow) {
        currentChange = getChange(currentMaxSteepness, seededRNG.get());
      } else {
        currentChange = -getChange(currentMaxSteepness, seededRNG.get());
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

  updateExplosions() {
    this.activeExplosions.forEach((explosion) => {
      explosion.particles.forEach((particle) => {
        particle.update();
        const underlyingTile = this.getTile(particle.x, particle.y);
        if (IMPENETRABLES.includes(underlyingTile)) {
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
  }

  updateProjectiles() {
    this.activeProjectiles.forEach((projectile) => {
      projectile.update();

      const tailTile = this.getTile(projectile.tailX, projectile.tailY);
      if (IMPENETRABLES_EXCEPT_TANKS.includes(tailTile)) {
        this.activeProjectiles.delete(projectile.hash);
        const explosion = new Explosion(projectile.tailX, projectile.tailY, { x: 0, y: 0 }, 6);
        this.activeExplosions.set(explosion.hash, explosion);
      }

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
        if (PROJECTILE_BLOCKERS_EXCEPT_TANKS.includes(tile)) {
          this.activeProjectiles.delete(projectile.hash);
          const explosion = new Explosion(prevCoords.x, prevCoords.y, { x: 0, y: 0 }, 6);
          this.activeExplosions.set(explosion.hash, explosion);
          break;
        }
      }
    });
  }

  update() {
    this.clearMapBeforeRender();
    this.renderTankToMap();
    this.updateExplosions();
    this.updateProjectiles();

    this.renderProjectilesToMap();
    this.renderExplosionsToMap();
  }
}


