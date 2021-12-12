var seedrandom = require('seedrandom');

export function randomInt(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export class SeededRNG {
  constructor(seed = 1) {
    this.seed = seed
    this.rng = seedrandom(seed);

  }

  get (min = 0, max = 1) {
    return this.rng() * (max - min) + min
  }
}