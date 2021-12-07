export default class KeyHandler {
  constructor() {
    this.pressedKeys = {
      down: false,
      up: false,
      left: false,
      right: false,
    };
    this.init();
  }

  init() {
    this.attachListener("keydown", true);
    this.attachListener("keyup", false);
  }

  attachListener(event, bool) {
    document.addEventListener(event, ({ key }) => {
      if (key === "ArrowUp") {
        this.pressedKeys.up = bool;
      }
      if (key === "ArrowDown") {
        this.pressedKeys.down = bool;
      }
      if (key === "ArrowRight") {
        this.pressedKeys.right = bool;
      }
      if (key === "ArrowLeft") {
        this.pressedKeys.left = bool;
      }
    });
  }
}
