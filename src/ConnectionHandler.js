const { io } = require('socket.io-client');

class ConnectionHandler {
  constructor() {
    this.socket = io('http://192.168.0.200:3100');
    this.socket.on('init', (msg) => console.log(msg));

    this.seed = null;
    this.code = null;
  }

  startNewGame() {
    this.socket.emit('createGame');
  }

  updateGameState(state) {
    this.socket.emit('updateGameState', state);
  }

  updatePausedState(state) {
    this.socket.emit('updatePausedState', state);
  }
}

const connectionHandler = new ConnectionHandler();

export default connectionHandler;