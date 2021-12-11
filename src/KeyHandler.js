export default class KeyHandler {
  constructor() {
    this.pressedKeys = {
      down: false,
      up: false,
      left: false,
      right: false,
      shoot: false,
    };
    this.init();
  }

  init() {
    this.attachListener('keydown', true);
    this.attachListener('keyup', false);
  }

  attachListener(event, bool) {
    document.addEventListener(event, (e) => {
      const key = e.key;

      if (key === 'ArrowUp') {
        e.preventDefault();
        this.pressedKeys.up = bool;
      }
      if (key === 'ArrowDown') {
        e.preventDefault();
        this.pressedKeys.down = bool;
      }
      if (key === 'ArrowRight') {
        e.preventDefault();
        this.pressedKeys.right = bool;
      }
      if (key === 'ArrowLeft') {
        e.preventDefault();
        this.pressedKeys.left = bool;
      }
      if (key === ' ' || key === 'x') {
        e.preventDefault();
        this.pressedKeys.shoot = bool;
      }
    });
  }
}
