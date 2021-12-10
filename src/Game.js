import KeyHandler from "./KeyHandler";
import GameMap from "./map/GameMap";
import { Base } from "./player/Base";
import Tank from "./player/Tank";
import Render from "./render/Render";
import Viewport from "./Viewport";

export default class Game {
  constructor() {
    this.fps = 18;
    this.fpsInterval = 1000 / this.fps;
    this.prevFrameTime = Date.now();
    this.gameMap = new GameMap(1200, 600, Math.random());
    this.viewport = new Viewport(this.gameMap);
    this.renderer = new Render(this.viewport);

    this.player = new Tank(3, this.gameMap, 5, 4, 12, 6);
    this.gameMap.addTank(this.player);
    this.gameMap.addBase(this.player.base);
    this.gameLoop();
  }

  gameLoop() {
    window.requestAnimationFrame(this.gameLoop.bind(this));
    const now = Date.now();
    const elapsed = now - this.prevFrameTime;

    if (elapsed > this.fpsInterval) {
      this.prevFrameTime = now - (elapsed % this.fpsInterval);
      this.update();
      this.player.update();
      this.gameMap.renderTankToMap(this.player);
      this.gameMap.update();
      this.viewport.update(this.player.x - (this.viewport.width / 2), this.player.y - (this.viewport.height / 2));
    }
  }

  update() {
    this.renderer.render();
  }
}
