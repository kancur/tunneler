export class Base {
  constructor(x, y, playerHash, colorCode) {
    this.x = x;
    this.y = y;
    this.colorCode = colorCode;
    this.ownerPlayer = playerHash;
    this.width = 35;
    this.height = 35;
    this.doorWidth = 7;
    this.shape = [];
    this.shape.length = this.width * this.height;
    this.shape.fill(0);
    this.drawShapePerimeter();
  }

  getTile(x, y) {
    return this.shape[x + y * this.width];
  }

  drawShapePerimeter() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
          if (x > ((this.width / 2) -4) && x < ((this.width / 2) + 3)) {
            this.shape[x + y * this.width] = 2;
          } else {
            this.shape[x + y * this.width] = 1;
          }
        }
      }
    }
  }
}
