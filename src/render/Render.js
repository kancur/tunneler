// 0 === stone
// 1 && 2 === ground
// 3 === empty cell
// 4 === tank tracks
// 5 === tank body
// 6 === barel

// prettier-ignore
const ground_colors = [
  { r: 154, g: 154, b: 154 }, // stone
  { r: 186, g: 89, b: 4 }, // ground 1
  { r: 195, g: 121, b: 48 },// ground 2
  { r: 0, g: 0, b: 0 },// empty cell (black)
  { r: 0, g: 0, b: 182 }, // tank tracks blue
  { r: 44, g: 44, b: 255 }, // tank body blue
  { r: 243, g: 235, b: 28 }, // tank barrel
];

export default class Render {
  constructor(viewport) {
    this.viewport = viewport;
    this.canvas = document.querySelector("canvas");
    this.canvas.width = viewport.width;
    this.canvas.height = viewport.height;
    this.ctx = this.canvas.getContext("2d");
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.pixels = this.imageData.data;

    this.init();
  }

  init() {
    this.canvas.style.height = "500px";
    this.canvas.style.imageRendering = "pixelated";
  }

  render() {
    for (let y = 0; y < this.viewport.height; y++) {
      for (let x = 0; x < this.viewport.width; x++) {
        const offset = y * this.viewport.width * 4 + x * 4;
        const currentTile = this.viewport.getTile(x, y);
        
        this.pixels[offset] = ground_colors[currentTile].r;
        this.pixels[offset + 1] = ground_colors[currentTile].g;
        this.pixels[offset + 2] = ground_colors[currentTile].b;
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
