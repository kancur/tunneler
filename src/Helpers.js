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

export function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export const delay = ms => new Promise(res => setTimeout(res, ms));
