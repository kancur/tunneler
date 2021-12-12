// 10 === projectile light
// 11 === projectile dark

export default class Projectile {
  constructor(x, y, vector2, number) {
    this.speed = 4; //pixels per update
    this.number = number;
    this.x = x;
    this.y = y;
    this.tailX = null;
    this.tailY = null;
    this.futurePath = null;
    this.vector2 = vector2;
    this.hash = Math.random().toString(36).slice(2);
  }

  calculateFuturePath() {
    this.futurePath = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = getNextSteps(this.x, this.y, this.vector2, i);
      this.futurePath.push({ x, y });
    }
  }

  update() {
    [this.x, this.y] = getNextSteps(this.x, this.y, this.vector2, this.speed);
    const [tailX, tailY] = getNextSteps(this.x, this.y, this.vector2, -1);
    this.tailX = tailX;
    this.tailY = tailY;
    this.calculateFuturePath();
  }
}

function getNextSteps(x, y, vector2, step = 4) {
  x += vector2.x * step;
  y += vector2.y * step;
  return [x, y];
}
