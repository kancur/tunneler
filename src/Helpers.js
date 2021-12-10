export function randomInt(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export class SeededRNG {
  constructor(seed = 1) {
    this.seed = seed
  }
 
  get(min, max) {
      max = max || 1;
      min = min || 0;

      this.seed = (this.seed * 9301 + 49297) % 233280;
      var rnd = this.seed / 233280;
      this.seed += 1;
      return min + rnd * (max - min);
  }
}