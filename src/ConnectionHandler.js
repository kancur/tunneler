const { io } = require('socket.io-client');

class ConnectionHandler {
  constructor() {
    this.socket = io('http://192.168.0.24:3100');
    this.socket.on('init', (msg) => console.log(msg));

    this.seed = null;
    this.code = null;
    //this.updateCount = 0;
  }

  startNewGame() {
    this.socket.emit('createGame');
  }

  updateGameState(state) {
    //this.updateCount += 1;
    const stateWithUpdateCount = { ...state, updateCount: this.updateCount };
    this.socket.emit('updateGameState', state);
    //this.socket.emit('updateGameState', {...state, updateCount: this.updateCount});
  }

  updatePausedState(state) {
    this.socket.emit('updatePausedState', state);
  }
}

const connectionHandler = new ConnectionHandler();

export default connectionHandler;