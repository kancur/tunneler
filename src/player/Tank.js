// 1 for tank tracks
// 2 for tank body
// 3 for barel

import { randomInt } from '../Helpers';
import KeyHandler from '../KeyHandler';
import { IMPENETRABLES, IMPENETRABLES_EXCEPT_TANKS } from '../map/GameMap';
import { Base } from './Base';
import Projectile from './Projectile';

export default class Tank {
  constructor(
    isPlayer,
    x,
    y,
    colorOffset,
    map,
    lightColorCode,
    darkColorCode,
    baseColorCode,
    barelColorCode,
    playerNumber
  ) {
    this.isPlayer = isPlayer;
    this.lightColor = lightColorCode;
    this.darkColor = darkColorCode;
    this.barelColor = barelColorCode;
    this.projectileBlockers = [lightColorCode, darkColorCode, barelColorCode];
    // impenetrables except the tank itself (and except ground)
    this.impenetrables = IMPENETRABLES.filter((code) => (code !== this.lightColor && code !== this.darkColor && code !== this.barelColor));
    this.playerNumber = playerNumber;
    this.gameMap = map;
    this.energy = 100;
    this.isDead = false;
    this.isExploded = false;
    this.isRenderedDead = false;
    this.shield = 100;
    this.direction = 'up';
    this.movementSpeed = 1;
    //this.x = randomInt(70, map.width - 70);
    //this.y = randomInt(70, map.height - 70);
    this.x = x;
    this.y = y;
    this.vector2 = { x: 0, y: -1 };
    this.originalX = x;
    this.originalY = y;
    this.isInAnyBase = true;
    this.keyState = {};
    this._originalWidth = 7;
    this._originalHeight = 7;
    this.width = this._originalWidth;
    this.height = this._originalHeight;
    this.hash = Math.random().toString(36).slice(2);
    this.base = new Base(this.x - 14, this.y - 14, this.hash, baseColorCode);
    this.framesSinceLastShot = 0;
    this.movementSpeed = 1; //pixel per update
    this.serverState = null;
    this.readyToMove = false;
    this.shotNumber = 0;
    // prettier-ignore
    this.tankUp = [
      0,0,0,3,0,0,0,
      0,1,0,3,0,1,0,
      0,1,2,3,2,1,0,
      0,1,2,3,2,1,0,
      0,1,2,2,2,1,0,
      0,1,2,2,2,1,0,
      0,1,0,0,0,1,0,
    ].map((x) => {
      if (x === 1) {
        return this.darkColor;
      }
      if (x === 2) {
        return this.lightColor;
      }
      if (x === 3) {
        return this.barelColor;
      }
      return 0;
    }
  );

    this.tankDown = this.tankUp.slice().reverse();
    this.tankRight = get90degRotatedOriginalShape(this.tankUp, this._originalWidth);
    this.tankLeft = this.tankRight.slice().reverse();
    // prettier-ignore
    this.tankTopRight = [
      0,0,0,1,0,0,0,
      0,0,1,2,0,3,0,
      0,1,2,2,3,0,0,
      1,2,2,3,2,2,1,
      0,0,2,2,2,1,0,
      0,0,0,2,1,0,0,
      0,0,0,1,0,0,0,
    ].map((x) => {
      if (x === 1) {
        return this.darkColor;
      }
      if (x === 2) {
        return this.lightColor;
      }
      if (x === 3) {
        return this.barelColor;
      }
      return 0;
    }
  );
    this.tankBottomRight = get90degRotatedOriginalShape(this.tankTopRight, this._originalHeight);
    this.tankBottomLeft = get90degRotatedOriginalShape(this.tankBottomRight, this._originalHeight);
    this.tankTopLeft = get90degRotatedOriginalShape(this.tankBottomLeft, this._originalHeight);
    this.currentTankShape = this.tankUp;
    this._prevTankShape = null;
    if (isPlayer) {
      this.keyHandler = new KeyHandler();
      this.drawEnergy();
    }
  }

  reset() {
    this.isDead = false;
    this.isExploded = false;
    this.isRenderedDead = false;
    this.isInAnyBase = true;
    this.energy = 100;
    this.shield = 100;
    this.direction = 'up';
    this.x = this.originalX
    this.y = this.originalY
    this.isInAnyBase = true;
    this.keyState = {};
    this.framesSinceLastShot = 0;
    this.serverState = null;
    this.shotNumber = 0;
    this.currentTankShape = this.tankUp;
  }

  die() {
    this.isDead = true;
  }

  resetTemps() {
    this.keyState = {};
  }

  getState() {
    const state = {
      ...this.keyState,
      x: this.x,
      y: this.y,
      dir: this.direction,
      sn: this.shotNumber,
      e: this.energy,
      s: this.shield,
    };
    /*     const state = {
      x: this.x,
      y: this.y,
      dir: this.direction,
      shoot: this.didShoot,
    }
    this.resetTemps(); */
    return state;
  }

  dumpState() {
    if (this.serverState) {
      //console.log('dumping state', this.serverState)
      const { x, y, dir, sn, e, s, ...keystate } = this.serverState;
      this.keyState = keystate;
      this.x = x;
      this.y = y;
      this.shotNumber = sn;
      this.direction = dir;
      this.energy = (e === null) ? 100 : e;
      this.shield = (s === null) ? 100 : s; 
      this.currentTankShape = this.getTankShape(dir);
      this.setVectorByDir(dir);
      //console.log('dumped keystate', this.keyState);
      this.serverState = null;
    }
  }

  drawEnergy(amount = 0.017) {
    this.energy = Math.round((this.energy - amount) * 100) / 100;
    if (this.energy <= 0) {
      this.energy = 0;
    }
  }

  receiveEnergy(amount) {
    if (this.energy === 0) return;
    this.energy += amount;
    if (this.energy >= 100) this.energy = 100;
  }

  receiveHit() { // drawShield
    this.shield -= 15;
    if (this.shield <= 0) this.shield = 0;
  }
 
  receiveShield(amount) {
    if (this.shield === 0) return;
    this.shield += amount;
    if (this.shield >= 100) this.shield = 100;
  }


  updateState(state) {
    this.serverState = state;
  }

  getTile(x, y) {
    return this.currentTankShape[y * this.width + x];
  }

  getPreviousTankTile(x, y) {
    return this._prevTankShape[y * this.width + x];
  }

  getOriginalTile(x, y) {
    return this.tankUp[y * this.width + x];
  }

  checkIfDirt() {
    /* if (this.direction === 'up') {
      for (let i = 0; i < this.width; i++) {
        const currentTile = this.gameMap.getTile(this.x + i, this.y - 1);
      }
    } */
  }

  setVectorByDir(dir) {
    switch (dir) {
      case 'up':
        this.vector2 = { x: 0, y: -1 };
        break;
      case 'down':
        this.vector2 = { x: 0, y: 1 };
        break;
      case 'left':
        this.vector2 = { x: -1, y: 0 };
        break;
      case 'right':
        this.vector2 = { x: 1, y: 0 };
        break;
      case 'topRight':
        this.vector2 = { x: 1, y: -1 };
        break;
      case 'topLeft':
        this.vector2 = { x: -1, y: -1 };
        break;
      case 'bottomRight':
        this.vector2 = { x: 1, y: 1 };
        break;
      case 'bottomLeft':
        this.vector2 = { x: -1, y: 1 };
        break;
    }
  }

  getTankShape(direction) {
    switch (direction) {
      case 'up':
        return this.tankUp;
      case 'down':
        return this.tankDown;
      case 'right':
        return this.tankRight;
      case 'left':
        return this.tankLeft;
      case 'topRight':
        return this.tankTopRight;
      case 'bottomRight':
        return this.tankBottomRight;
      case 'bottomLeft':
        return this.tankBottomLeft;
      case 'topLeft':
        return this.tankTopLeft;
    }
  }

  rotateUp() {
    if (this.isLegalMove(this.x, this.y, this.tankUp)) {
      this.direction = 'up';
      this.currentTankShape = this.getTankShape('up');
      this.vector2 = { x: 0, y: -1 };
    } else {
    }
  }

  rotateDown() {
    if (this.isLegalMove(this.x, this.y, this.tankDown)) {
      this.direction = 'down';
      this.currentTankShape = this.getTankShape('down');
      this.vector2 = { x: 0, y: 1 };
    } else {
    }
  }

  rotateRight() {
    if (this.isLegalMove(this.x, this.y, this.tankRight)) {
      this.direction = 'right';
      this.currentTankShape = this.getTankShape('right');
      this.vector2 = { x: 1, y: 0 };
    } else {
    }
  }

  rotateLeft() {
    if (this.isLegalMove(this.x, this.y, this.tankLeft)) {
      this.direction = 'left';
      this.currentTankShape = this.getTankShape('left');
      this.vector2 = { x: -1, y: 0 };
    } else {
    }
  }

  rotateTopRight() {
    if (this.isLegalMove(this.x, this.y, this.tankTopRight)) {
      this.direction = 'topRight';
      this.currentTankShape = this.getTankShape('topRight');
      this.vector2 = { x: 1, y: -1 };
    } else {
    }
  }
  rotateBottomRight() {
    if (this.isLegalMove(this.x, this.y, this.tankBottomRight)) {
      this.direction = 'bottomRight';
      this.currentTankShape = this.getTankShape('bottomRight');
      this.vector2 = { x: 1, y: 1 };
    } else {
    }
  }
  rotateBottomLeft() {
    if (this.isLegalMove(this.x, this.y, this.tankBottomLeft)) {
      this.direction = 'bottomLeft';
      this.currentTankShape = this.getTankShape('bottomLeft');
      this.vector2 = { x: -1, y: 1 };
    } else {
    }
  }
  rotateTopLeft() {
    if (this.isLegalMove(this.x, this.y, this.tankTopLeft)) {
      this.direction = 'topLeft';
      this.currentTankShape = this.getTankShape('topLeft');
      this.vector2 = { x: -1, y: -1 };
    } else {
    }
  }

  isLegalMove(x, y, shape) {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        // ignore tiles of type 0 on tank
        if (shape[j * this.width + i] !== 0) {
          const underlyingTile = this.gameMap.getTile(x + i, y + j);
          if (this.impenetrables.includes(underlyingTile)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  moveByVector(vector2) {
    if (this.readyToMove) {
      if (
        this.isLegalMove(
          this.x + vector2.x * this.movementSpeed,
          this.y + vector2.y * this.movementSpeed,
          this.currentTankShape
        )
      ) {
        this.x += vector2.x * this.movementSpeed;
        this.y += vector2.y * this.movementSpeed;
      }
    }
  }

  shootProjectile(shotNumber) {
    this.gameMap.pushProjectile(
      new Projectile(this.x + 3, this.y + 3, this.vector2, shotNumber, this.playerNumber)
    );
    this.framesSinceLastShot = 0;
  }

  update() {
    this.resetTemps();
    if (this.isDead) return;


    if (!this.isPlayer) {
      this.dumpState();
    }

    
    if (this.shield <= 0 || this.energy <= 0) {
      this.die();
    }


    this.framesSinceLastShot += 1;

    let up,
      down,
      right,
      left,
      shoot = null;
      
    if (this.isPlayer) {
      ({ up, down, right, left, shoot } = this.keyHandler.pressedKeys);
      this.keyState = this.keyHandler.pressedKeys;
    } else {
      //({ up, down, right, left, shoot } = this.keyState);
      ({ shoot } = this.keyState);
    }

    if (shoot && this.framesSinceLastShot >= 2) {
      if (this.isPlayer) {
        this.shotNumber += 1;
        if (!this.isInAnyBase) {
          this.drawEnergy(1);
        }
      }
      this.shootProjectile(this.shotNumber);
    }

    if (this.isPlayer && !this.isInAnyBase) {
      this.drawEnergy();
    }

    // duplicate rotations are to handle an edge case where the first rotation failed due to costraints
    // the tank is allowed to "reverse" but should immediately rotate to the correct orientation in the same gameupdate
    if (up && right) {
      this.rotateTopRight();
      this.moveByVector({ x: 1, y: -1 });
      this.rotateTopRight();
    } else if (right && down) {
      this.rotateBottomRight();
      this.moveByVector({ x: 1, y: 1 });
      this.rotateBottomRight();
    } else if (down && left) {
      this.rotateBottomLeft();
      this.moveByVector({ x: -1, y: 1 });
      this.rotateBottomLeft();
    } else if (up && left) {
      this.rotateTopLeft();
      this.moveByVector({ x: -1, y: -1 });
      this.rotateTopLeft();
    } else if (up) {
      this.rotateUp();
      this.moveByVector({ x: 0, y: -1 });
      this.rotateUp();
    } else if (down) {
      this.rotateDown();
      this.moveByVector({ x: 0, y: 1 });
      this.rotateDown();
    } else if (right) {
      this.rotateRight();
      this.moveByVector({ x: 1, y: 0 });
      this.rotateRight();
    } else if (left) {
      this.rotateLeft();
      this.moveByVector({ x: -1, y: 0 });
      this.rotateLeft();
    }

    if (left || right || up || down) {
      this.readyToMove = true;
    } else {
      this.readyToMove = false;
    }
  }
}

function get90degRotatedOriginalShape(matrix, width) {
  const rotatedTank = [];
  for (let x = 0; x < width; x++) {
    for (let y = matrix.length / width - 1; y >= 0; y--) {
      rotatedTank.push(matrix[[y * width + x]]);
    }
  }
  return rotatedTank;
}
