const COLORS = {
  lightGray: '#747474',
  darkGray: '#383838',
  yellow: '#f3eb1c',
  cyan: '#28f3f3',
};

export default class StatsDisplay {
  constructor() {
    this.energy = 100;
    this.shield = 100;
    this.canvas = document.querySelector('#gamestats');
    this.ctx = this.canvas.getContext('2d');
    this.canvasInit();
    this.drawInit();
  }

  update(energy, shield) {
    this.energy = energy;
    this.shield = shield;
    this.redrawBars();
  }

  canvasInit() {
    this.canvas.width = 68;
    this.canvas.height = 25;
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.backgroundColor = '#656565';
    this.canvas.style.height = '300px';
  }

  drawInit() {
    // main rectangle
    this.ctx.fillStyle = COLORS.darkGray;
    this.ctx.fillRect(this.canvas.width - 2, 0, 2, this.canvas.height); //right
    this.ctx.fillStyle = COLORS.lightGray;
    this.ctx.fillRect(0, 0, this.canvas.width, 1); //top
    this.ctx.fillRect(0, 0, 2, this.canvas.height); //left
    this.ctx.fillStyle = COLORS.darkGray;
    this.ctx.fillRect(0, this.canvas.height - 1, this.canvas.width, 1); //bottom

    this.drawInnerRectangle(0);
    this.drawInnerRectangle(11);
  }

  drawInnerRectangle(yOffset) {
    const right = this.canvas.width - 6;
    const left = 12;
    const top = 3 + yOffset;
    const width = 52;

    this.ctx.fillStyle = COLORS.darkGray;
    this.ctx.fillRect(this.canvas.width - 6, top, 2, 8); //right
    this.ctx.fillStyle = COLORS.lightGray;
    this.ctx.fillRect(left, top, width, 1); //top
    this.ctx.fillRect(left, top, 2, 8); //left
    this.ctx.fillStyle = COLORS.darkGray;
    this.ctx.fillRect(left, top + 7, width, 1); //top

    this.drawLetters();
    this.redrawBars();
  }

  drawLetters() {
    // Energy
    this.ctx.fillStyle = COLORS.yellow
    this.ctx.fillRect(4,5, 6, 1)
    this.ctx.fillRect(4,7, 6, 1)
    this.ctx.fillRect(4,9, 6, 1)
    this.ctx.fillRect(4,5, 1, 5)

    // Shield
    this.ctx.fillStyle = COLORS.cyan
    this.ctx.fillRect(4,16, 6, 1)
    this.ctx.fillRect(4,16, 1, 3)
    this.ctx.fillRect(4,18, 6, 1)
    this.ctx.fillRect(9,18, 1, 3)
    this.ctx.fillRect(4,20, 6, 1)
  }

  redrawBars(energy, shield) {
    this.reDrawBar(COLORS.yellow, 0, this.energy);
    this.reDrawBar(COLORS.cyan, 11, 100, this.shield);
  }

  reDrawBar(color, yOffset, percentage) {
    const width = Math.floor(44 / 100 * percentage)
    this.ctx.fillStyle = COLORS.lightGray;
    this.ctx.fillRect(16, 5 + yOffset, 44, 4);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(16, 5 + yOffset, width, 4);
  }
}
