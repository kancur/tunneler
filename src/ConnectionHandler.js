const { io } = require('socket.io-client');
const equal = require('fast-deep-equal');

class ConnectionHandler {
  constructor() {
    this.socket = io('http://192.168.0.24:3100');
    this.socket.on('init', (msg) => console.log(msg));

    this.seed = null;
    this.code = null;
    this.previousSentState = {};
  }

  startNewGame() {
    this.socket.emit('createGame');
  }

  updateGameState(state) {
    if (equal(this.previousSentState, state)) return;
    this.socket.emit('updateGameState', state);
    this.previousSentState = state;
  }


  updatePausedState(state) {
    this.socket.emit('updatePausedState', state);
  }
}

const connectionHandler = new ConnectionHandler();

export default connectionHandler;