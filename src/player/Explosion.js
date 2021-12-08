import Particle from "./Particle";

export default class Explosion {
  constructor(x, y, vector2){
    this.x = x;
    this.y = y;
    this.vector2 = vector2;
    this.numberOfParticles = 6
    this.particles = new Map();
    this.init()
  }

  init() {
    for (let i = 0; i < this.numberOfParticles; i++){
      const particle = new Particle(this.x, this.y, this.vector2)
      this.particles.set(particle.hash, particle)
    }
  }

  update(){
    this.particles.forEach((particle) => {
      particle.update();
    })
  }
}

// maxLength not normalised
function getRandomVector(maxLength) {
  return {
    x: Math.floor(Math.random() * maxLength + 1),
    y: Math.floor(Math.random() * maxLength + 1)
  }
}