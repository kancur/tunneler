export default class Overlay {
  constructor() {
    this.body = document.querySelector('body');
    this.overlay = document.createElement('div');
    this.overlay.style.display = 'none';
    this.overlay.classList.add('overlay');

    this.heading = document.createElement('h1');
    this.heading.textContent =
      'The other player has minimized the game. Please wait till he opens the window again.';

    this.overlay.appendChild(this.heading);
    this.body.appendChild(this.overlay);
  }

  show() {
    this.overlay.style.display = 'flex';
  }
  hide() {
    this.overlay.style.display = 'none';
  }
}
