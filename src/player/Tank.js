// 1 for tank tracks
// 2 for tank body
// 3 for barel

import KeyHandler from '../KeyHandler';
import { Base } from './Base';
import Projectile from './Projectile';

export default class Tank {
  constructor(colorOffset, map, lightColorCode, darkColorCode, baseColorCode) {
    this.lightColor = lightColorCode;
    this.darkColor = darkColorCode;
    this.gameMap = map;
    this.movementSpeed = 1;
    this.x = 50;
    this.y = 50;
    this.vector2 = { x: 0, y: -1 };
    this._prevX;
    this._prevY;
    this._originalWidth = 7;
    this._originalHeight = 7;
    this.width = this._originalWidth;
    this.height = this._originalHeight;
    this.hash = Math.random().toString(36).slice(2);
    this.base = new Base(this.x - 15, this.y - 14, this.hash, baseColorCode);
    this.framesSinceLastShot = 0;
    this.movementSpeed = 1; //pixel per update
    this.readyToMove = false;
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
        return 6;
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
    ].map((x) =>
    x !== 0 ? x + colorOffset : 0
  );
    this.tankBottomRight = get90degRotatedOriginalShape(this.tankTopRight, this._originalHeight);
    this.tankBottomLeft = get90degRotatedOriginalShape(this.tankBottomRight, this._originalHeight);
    this.tankTopLeft = get90degRotatedOriginalShape(this.tankBottomLeft, this._originalHeight);
    this.currentTankShape = this.tankUp;
    this._prevTankShape = null;
    this.keyHandler = new KeyHandler();
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

  rotateUp() {
    this.currentTankShape = this.tankUp;
    this.vector2 = { x: 0, y: -1 };
    this.setWidths('vertical');
  }

  rotateDown() {
    this.currentTankShape = this.tankDown;
    this.vector2 = { x: 0, y: 1 };
    this.setWidths('vertical');
  }

  rotateRight() {
    this.currentTankShape = this.tankRight;
    this.vector2 = { x: 1, y: 0 };
    this.setWidths('horizontal');
  }

  rotateLeft() {
    this.currentTankShape = this.tankLeft;
    this.vector2 = { x: -1, y: 0 };
    this.setWidths('horizontal');
  }

  rotateTopRight() {
    this.currentTankShape = this.tankTopRight;
    this.vector2 = { x: 1, y: -1 };
    this.setWidths('diagonal');
  }
  rotateBottomRight() {
    this.currentTankShape = this.tankBottomRight;
    this.vector2 = { x: 1, y: 1 };
    this.setWidths('diagonal');
  }
  rotateBottomLeft() {
    this.currentTankShape = this.tankBottomLeft;
    this.vector2 = { x: -1, y: 1 };
    this.setWidths('diagonal');
  }
  rotateTopLeft() {
    this.currentTankShape = this.tankTopLeft;
    this.vector2 = { x: -1, y: -1 };
    this.setWidths('diagonal');
  }

  moveByCurrentVector() {
    if (this.readyToMove) {
      this.x += this.vector2.x * this.movementSpeed;
      this.y += this.vector2.y * this.movementSpeed;
    }
  }

  setWidths(orientation) {
    if (orientation === 'vertical') {
      this.width = this._originalWidth;
      this.height = this._originalHeight;
    } else if (orientation === 'horizontal') {
      this.width = this._originalHeight;
      this.height = this._originalWidth;
    } else if (orientation === 'diagonal') {
      this.width = this._originalHeight;
      this.height = this._originalHeight;
    }
  }

  shootProjectile() {
    this.gameMap.pushProjectile(new Projectile(this.x + 3, this.y + 3, this.vector2));
    this.framesSinceLastShot = 0;
  }

  update() {
    this.framesSinceLastShot += 1;
    const { up, down, right, left, shoot } = this.keyHandler.pressedKeys;

    if (shoot && this.framesSinceLastShot >= 2) {
      this.shootProjectile();
    }

    if (up && right) {
      this.rotateTopRight();
      this.moveByCurrentVector();
    } else if (right && down) {
      this.rotateBottomRight();
      this.moveByCurrentVector();
    } else if (down && left) {
      this.rotateBottomLeft();
      this.moveByCurrentVector();
    } else if (up && left) {
      this.rotateTopLeft();
      this.moveByCurrentVector();
    } else if (up) {
      this.rotateUp();
      this.moveByCurrentVector();
    } else if (down) {
      this.rotateDown();
      this.moveByCurrentVector();
    } else if (right) {
      this.rotateRight();
      this.moveByCurrentVector();
    } else if (left) {
      this.rotateLeft();
      this.moveByCurrentVector();
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
