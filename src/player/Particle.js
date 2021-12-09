export default class Particle {
  constructor(x, y, vector2) {
    this.x = x;
    this.y = y;
    this.vector2 = vector2;
    this.hash = Math.random().toString(36).slice(2);
    this.life = 3;
  }

  update() {
    if (this.life === 0) return;
    if (this.vector2.x !== 0){
      this.x += this.vector2.x * Math.floor(Math.random() * 3);
    } else { 
      this.x += Math.floor(Math.random() * 3) - 1;
    }
    if (this.vector2.y !== 0){
      this.y += this.vector2.y * Math.floor(Math.random() * 3);
    } else {
      this.y += Math.floor(Math.random() * 3) - 1;
    }
    this.life -= 1;
  }
}