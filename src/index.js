import Game from "./Game";
import GameMap from "./map/GameMap";
import Render from "./render/Render";
import Viewport from "./Viewport";

const gameMap = new GameMap();
const viewport = new Viewport(gameMap);

const game = new Game();

const pressedKeys = {
  down: false,
  up: false,
  left: false,
  right: false,
};


/* document.addEventListener("keydown", ({ key }) => {
  if (key === "ArrowUp") {
    pressedKeys.up = true;
  }
  if (key === "ArrowDown") {
    pressedKeys.down = true;
  }
  if (key === "ArrowRight") {
    pressedKeys.right = true;
  }
  if (key === "ArrowLeft") {
    pressedKeys.left = true;
  }
});

document.addEventListener("keyup", ({ key }) => {
  if (key === "ArrowUp") {
    pressedKeys.up = false;
  }
  if (key === "ArrowDown") {
    pressedKeys.down = false;
  }
  if (key === "ArrowRight") {
    pressedKeys.right = false;
  }
  if (key === "ArrowLeft") {
    pressedKeys.left = false;
  }
}); */

//x += 1;


