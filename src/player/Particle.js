export default class Particle {
  constructor(x, y, vector2) {
    this.x = x;
    this.y = y;
    this.vector2 = vector2;
    this.hash = Math.random().toString(36).slice(2);
  }

  update() {
    this.x = vector2.x * Math.floor(Math.random() * 2);
    this.y = vector2.y * Math.floor(Math.random() * 2);
  }
}
