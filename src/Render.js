// 0 === stone
// 1 && 2 === ground
// 3 === empty cell
// 4 === tank tracks blue
// 5 === tank body blue
// 6 === barel tank blue
// 7 === tank tracks green
// 8 === tank body green
// 9 === barel tank green
// 10 === projectile light
// 11 === projectile dark
// 12 === blue base
// 13 === green base

// prettier-ignore
const colors = [
  { r: 154, g: 154, b: 154 }, // stone
  { r: 186, g: 89, b: 4 }, // ground 1
  { r: 195, g: 121, b: 48 },// ground 2
  { r: 0, g: 0, b: 0 },// empty cell (black)
  { r: 0, g: 0, b: 182 }, // tank tracks blue
  { r: 44, g: 44, b: 255 }, // tank body blue
  { r: 243, g: 235, b: 28 }, // tank barrel blue
  { r: 0, g: 182, b: 0 }, // tank tracks green
  { r: 44, g: 255, b: 44 }, // tank body green
  { r: 243, g: 235, b: 28 }, // tank barrel green
  { r: 255, g: 52, b: 8 }, // projectile light
  { r: 186, g: 0, b: 0 }, // projectile dark
  { r: 44, g: 44, b: 255 }, // blue base 
  { r: 44, g: 255, b: 44 }, // green base 

];

export default class Render {
  constructor(viewport) {
    this.viewport = viewport;
    this.canvas = document.querySelector('#gamecanvas');
    this.canvas.width = viewport.width;
    this.canvas.height = viewport.height;
    this.ctx = this.canvas.getContext('2d');
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.pixels = this.imageData.data;
    this.showStatic = true;

    this.init();
  }

  init() {
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.backgroundColor = 'black';
  }

  render() {
    if (this.showStatic) {
      for (let i = 0; i < this.viewport.height * this.viewport.width; i++) {
        const offset = i * 4;
        this.pixels[offset] = Math.floor(Math.random() * 255);
        this.pixels[offset + 1] = Math.floor(Math.random() * 255);
        this.pixels[offset + 2] = Math.floor(Math.random() * 255);
        this.pixels[offset + 3] = Math.floor(Math.random() * 100) + 155;
      }
      this.flushPixels();
      return;
    }

    for (let y = 0; y < this.viewport.height; y++) {
      for (let x = 0; x < this.viewport.width; x++) {
        const offset = y * this.viewport.width * 4 + x * 4;
        const currentTile = this.viewport.getTile(x, y);

        this.pixels[offset] = colors[currentTile].r;
        this.pixels[offset + 1] = colors[currentTile].g;
        this.pixels[offset + 2] = colors[currentTile].b;
        this.pixels[offset + 3] = 255;
      }
    }
    this.flushPixels();
  }

  flushPixels() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
