export default class Overlay {
  constructor(text) {
    this.body = document.querySelector('body');
    this.overlay = document.createElement('div');
    this.overlay.style.display = 'none';
    this.overlay.classList.add('overlay');

    this.heading = document.createElement('h1');
    this.heading.textContent = text;
    this.overlay.appendChild(this.heading);
    this.body.appendChild(this.overlay);
  }

  setText(text) {
    this.heading.textContent = text;
  } 

  show() {
    this.overlay.style.display = 'flex';
  }
  hide() {
    this.overlay.style.display = 'none';
  }
}
