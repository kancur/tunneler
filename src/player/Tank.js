// 1 for tank tracks
// 2 for tank body
// 3 for barel

import KeyHandler from '../KeyHandler';

export default class Tank {
  constructor(colorOffset) {
    this.movementSpeed = 1;
    this.x = 50;
    this.y = 50;
    this._originalWidth = 7;
    this._originalHeight = 7;
    this.width = this._originalWidth;
    this.height = this._originalHeight;
    this.movementSpeed = 0; //pixel per update
    // prettier-ignore
    this.tankUp = [
      0,0,0,3,0,0,0,
      0,1,0,3,0,1,0,
      0,1,2,3,2,1,0,
      0,1,2,3,2,1,0,
      0,1,2,2,2,1,0,
      0,1,2,2,2,1,0,
      0,1,0,0,0,1,0,
    ].map((x) =>
    x !== 0 ? x + colorOffset : 0
  );
    this.tankDown = this.tankUp.slice().reverse();
    this.tankRight = get90degRotatedOriginalShape(
      this.tankUp,
      this._originalWidth
    );
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
    this.tankBottomRight = get90degRotatedOriginalShape(
      this.tankTopRight,
      this._originalHeight
    );
    this.tankBottomLeft = get90degRotatedOriginalShape(
      this.tankBottomRight,
      this._originalHeight
    );
    this.tankTopLeft = get90degRotatedOriginalShape(
      this.tankBottomLeft,
      this._originalHeight
    );
    this.currentTankShape = this.tankUp;
    this.keyHandler = new KeyHandler();
  }

  getTile(x, y) {
    return this.currentTankShape[y * this.width + x];
  }

  getOriginalTile(x, y) {
    return this.tankUp[y * this.width + x];
  }

  rotateUp() {
    this.currentTankShape = this.tankUp;
    this.lastDirection = 'up';
    this.setWidths('vertical');
  }

  rotateDown() {
    this.currentTankShape = this.tankDown;
    this.lastDirection = 'down';
    this.setWidths('vertical');
  }

  rotateRight() {
    this.currentTankShape = this.tankRight;
    this.lastDirection = 'right';
    this.setWidths('horizontal');
  }

  rotateLeft() {
    this.currentTankShape = this.tankLeft;
    this.lastDirection = 'left';
    this.setWidths('horizontal');
  }

  rotateTopRight() {
    this.currentTankShape = this.tankTopRight;
    this.lastDirection = 'topRight';
    this.setWidths('diagonal');
  }
  rotateBottomRight() {
    this.currentTankShape = this.tankBottomRight;
    this.lastDirection = 'bottomRight';
    this.setWidths('diagonal');
  }
  rotateBottomLeft() {
    this.currentTankShape = this.tankBottomLeft;
    this.lastDirection = 'bottomLeft';
    this.setWidths('diagonal');
  }
  rotateTopLeft() {
    this.currentTankShape = this.tankTopLeft;
    this.lastDirection = 'topLeft';
    this.setWidths('diagonal');
  }

  moveUp() {
    if ((this.lastDirection = 'up')) {
      this.y -= this.movementSpeed;
    }
    this.rotateUp();
  }
  moveDown() {
    this.rotateDown();
    this.y += this.movementSpeed;
  }
  moveRight() {
    this.rotateRight();
    this.x += this.movementSpeed;
  }
  moveLeft() {
    this.rotateLeft();
    this.x -= this.movementSpeed;
  }
  moveTopRight() {
    this.rotateTopRight();
    this.x += this.movementSpeed;
    this.y -= this.movementSpeed;
  }
  moveBottomRight() {
    this.rotateBottomRight();
    this.x += this.movementSpeed;
    this.y += this.movementSpeed;
  }
  moveBottomLeft() {
    this.rotateBottomLeft();
    this.x -= this.movementSpeed;
    this.y += this.movementSpeed;
  }
  moveTopLeft() {
    this.rotateTopLeft();
    this.x -= this.movementSpeed;
    this.y -= this.movementSpeed;
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

  update() {
    const { up, down, right, left } = this.keyHandler.pressedKeys;

    if (up && right) {
      this.moveTopRight();
      return;
    }

    if (right && down) {
      this.moveBottomRight();
      return;
    }

    if (down && left) {
      this.moveBottomLeft();
      return;
    }

    if (up && left) {
      this.moveTopLeft();
      return;
    }

    if (up) {
      this.moveUp();
      return;
    }
    if (down) {
      this.moveDown();
      return;
    }
    if (right) {
      this.moveRight();
      return;
    }
    if (left) {
      this.moveLeft();
      return;
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
