import KeyHandler from './KeyHandler';
import GameMap from './map/GameMap';
import { Base } from './player/Base';
import Tank from './player/Tank';
import Render from './render/Render';
import Viewport from './Viewport';

import connectionHandler from './ConnectionHandler';
import Overlay from './Overlay';

const blueTankColors = [5, 4, 12, 6];
const greenTankColors = [8, 7, 13, 9];

export default class Game {
  constructor(seed, playersData, activePlayerNumber) {
    this.pausedState = {};
    this.paused = false;
    this.playerNumber = activePlayerNumber;
    this.playerTankColors = activePlayerNumber === 0 ? blueTankColors : greenTankColors;
    this.enemyTankColors = activePlayerNumber === 0 ? greenTankColors : blueTankColors;

    this.overlay = new Overlay();

    this.fps = 18;
    this.fpsInterval = 1000 / this.fps;
    this.prevFrameTime = Date.now();
    this.gameMap = new GameMap(1200, 600, seed);
    this.viewport = new Viewport(this.gameMap);
    this.renderer = new Render(this.viewport);

    this.player = new Tank(
      true,
      playersData[activePlayerNumber].x,
      playersData[activePlayerNumber].y,
      3,
      this.gameMap,
      ...this.playerTankColors
    );
    this.enemy = new Tank(
      false,
      playersData[activePlayerNumber === 0 ? 1 : 0].x,
      playersData[activePlayerNumber === 0 ? 1 : 0].y,
      3,
      this.gameMap,
      ...this.enemyTankColors
    );

    this.players = [this.player, this.enemy];

    this.players.forEach((player) => {
      this.gameMap.addTank(player);
      this.gameMap.addBase(player.base);
    });

    connectionHandler.socket.on('stateUpdate', (data) => {
      const enemyData = data[activePlayerNumber === 0 ? 1 : 0];
      //console.log(enemyData);
      if (!enemyData) return;
      this.enemy.updateState(enemyData.x, enemyData.y, enemyData.dir);
    });

    connectionHandler.socket.on('pausedUpdate', (data) => {
      console.log(data);
      if (data) {
        this.pausedState = data;
      }
    });
    this.init();
    this.gameLoop();
  }

  init() {
    window.addEventListener('blur', this.handleFocusLost.bind(this));
    window.addEventListener('focus', this.handleFocus.bind(this));
  }

  isAnyPaused() {
    const objectKeys = Object.keys(this.pausedState);
    if (objectKeys.length === 0) return false;
    return objectKeys.some((key) => this.pausedState[key] === true);
  }

  handleFocusLost() {
    connectionHandler.updatePausedState({ paused: true, playerNumber: this.playerNumber });
  }
  handleFocus() {
    connectionHandler.updatePausedState({ paused: false, playerNumber: this.playerNumber });
  }

  gameLoop() {
    window.requestAnimationFrame(this.gameLoop.bind(this));
    this.paused = this.isAnyPaused();
    if (this.paused) {
      this.overlay.show();
      return;
    } else {
      this.overlay.hide();
    }

    const now = Date.now();
    const elapsed = now - this.prevFrameTime;
    connectionHandler.updateGameState({
      x: this.player.x,
      y: this.player.y,
      dir: this.player.direction,
      playerNumber: this.playerNumber,
    });

    if (elapsed > this.fpsInterval) {
      this.prevFrameTime = now - (elapsed % this.fpsInterval);
      this.update();
      this.player.update();
      //this.enemy.update();
      this.gameMap.update();
      this.viewport.update(
        this.player.x - this.viewport.width / 2,
        this.player.y - this.viewport.height / 2
      );
    }
  }

  update() {
    this.renderer.render();
  }
}
