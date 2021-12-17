import Particle from './Particle';

export default class Explosion {
  constructor(x, y, vector2, numberOfParticles = 6, seed, lifeSpan = 3) {
    this.seed = seed * numberOfParticles; // needed so the seeds in individual particles are different on explosion
    this.x = x;
    this.y = y;
    this.vector2 = vector2;
    this.numberOfParticles = numberOfParticles;
    this.lifeSpan = lifeSpan;
    this.particles = new Map();
    this.hash = Math.random().toString(36).slice(2);
    this.init();
  }

  init() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      const particle = new Particle(this.x, this.y, this.vector2, this.seed + i, this.lifeSpan);
      this.particles.set(particle.hash, particle);
    }
  }

  /*   update(){
    this.particles.forEach((particle) => {
      particle.update();
    })
  } */
}

// maxLength not normalised
function getRandomVector(maxLength) {
  return {
    x: Math.floor(Math.random() * maxLength + 1),
    y: Math.floor(Math.random() * maxLength + 1),
  };
}
