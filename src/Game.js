import KeyHandler from './KeyHandler';
import GameMap from './map/GameMap';
import { Base } from './player/Base';
import Tank from './player/Tank';
import Render from './Render';
import Viewport from './Viewport';
import StatsDisplay from './StatsDisplay';

import connectionHandler from './ConnectionHandler';
import Overlay from './Overlay';

const blueTankColors = [5, 4, 12, 6];
const greenTankColors = [8, 7, 13, 9];

export default class Game {
  constructor(seed, playersData, activePlayerNumber) {
    this.pausedState = {};
    this.paused = false;
    this.currentRound = 1;
    this.roundSwitching = false;
    this.maxRounds = 5;
    this.playerNumber = activePlayerNumber;
    this.enemyNumber = activePlayerNumber === 0 ? 1 : 0;
    this.playerTankColors = activePlayerNumber === 0 ? blueTankColors : greenTankColors;
    this.enemyTankColors = activePlayerNumber === 0 ? greenTankColors : blueTankColors;

    this.overlay = new Overlay(
      'The other player has minimized the game. Please wait till he opens the window again.'
    );
    this.midRoundOverlay = new Overlay();

    this.fps = 18;
    this.fpsInterval = 1000 / this.fps;
    this.prevFrameTime = Date.now();
    this.statsDisplay = new StatsDisplay();
    this.gameMap = new GameMap(1200, 600, seed);
    this.viewport = new Viewport(this.gameMap);
    this.renderer = new Render(this.viewport);
    this.playerScore = 0;
    this.enemyScore = 0;

    this.player = new Tank(
      true,
      playersData[activePlayerNumber].x,
      playersData[activePlayerNumber].y,
      3,
      this.gameMap,
      ...this.playerTankColors,
      this.playerNumber
    );
    this.enemy = new Tank(
      false,
      playersData[activePlayerNumber === 0 ? 1 : 0].x,
      playersData[activePlayerNumber === 0 ? 1 : 0].y,
      3,
      this.gameMap,
      ...this.enemyTankColors,
      this.enemyNumber
    );

    this.players = [this.player, this.enemy];
    this.bases = [this.player.base, this.enemy.base];

    this.players.forEach((player) => {
      this.gameMap.addTank(player);
      this.gameMap.addBase(player.base);
    });

    connectionHandler.socket.on('stateUpdate', (data) => {
      const enemyData = data[activePlayerNumber === 0 ? 1 : 0];
      if (!enemyData) return;
      this.enemy.updateState(enemyData);
    });

    connectionHandler.socket.on('pausedUpdate', (data) => {
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

  isInBase(tank) {
    for (let i = 0; i < this.bases.length; i++) {
      const base = this.bases[i];
      if (tank.x >= base.x && tank.x < base.x + base.width - tank.width) {
        // assumes that tank is square
        if (tank.y >= base.y && tank.y <= base.y + base.height - tank.width) {
          // assumes that tank is square
          return i; // 0 for player, 1 for enemy base
        }
      }
    }
    return -1; // -1 for not in base
  }

  async endRound() {
    let counter = 3;
    this.midRoundOverlay.setText(`Round ${this.currentRound} over! Next round in ${counter} seconds...`);
    this.midRoundOverlay.show();

    const countdown = () =>
      new Promise((resolve) => {
        const interval = setInterval(() => {
          counter -= 1;
          this.midRoundOverlay.setText(`Round ${this.currentRound} over! Next round in ${counter} seconds...`);
          if (counter === 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    await countdown();
    this.midRoundOverlay.hide();
    this.player.reset();
    this.enemy.reset();
    this.roundSwitching = false;
    this.currentRound++;
  }

  isAnyTankDead() {
    return this.player.isDead || this.enemy.isDead;
  }

  shouldShowStatic() {
    if (this.player.energy < 20) {
      if (Math.random() * 20 > this.player.energy + 3) {
        this.renderer.showStatic = true;
        return;
      }
    }
    this.renderer.showStatic = false;
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

    // --------------------------------
    if (elapsed > this.fpsInterval) {
      // fps limited gameloop starts here

      this.prevFrameTime = now - (elapsed % this.fpsInterval);

      const baseIndex = this.isInBase(this.player);
      if (baseIndex >= 0) {
        this.player.isInAnyBase = true;
      } else {
        this.player.isInAnyBase = false;
      }

      if (baseIndex === 0) {
        // player in home base
        this.player.receiveEnergy(0.7);
        this.player.receiveShield(0.35);
      } else if (baseIndex === 1) {
        this.player.receiveEnergy(0.27); // player in enemy base
      }

      if (this.isAnyTankDead()) {
        if (this.roundSwitching === false) {
          if (this.player.isDead) {
            this.playerScore += 1;
          }
          if (this.enemy.isDead) {
            this.enemyScore += 1;
          }
          setTimeout(() => {
            this.endRound();
          }, 2000);
        }
        this.roundSwitching = true;
      }

      this.player.update();
      this.shouldShowStatic();
      connectionHandler.updateGameState({ pN: this.playerNumber, ...this.player.getState() });
      this.enemy.update();
      this.gameMap.update();
      this.viewport.update(
        this.player.x - this.viewport.width / 2,
        this.player.y - this.viewport.height / 2
      );
      this.renderer.render();
      this.statsDisplay.update(this.player.energy, this.player.shield);
    }
  }
}
