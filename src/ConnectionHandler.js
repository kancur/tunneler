const { io } = require('socket.io-client');
const equal = require('fast-deep-equal');

class ConnectionHandler {
  constructor() {
    //this.socket = io('http://192.168.0.200:3100');
    this.socket = io('https://tunneler-server.herokuapp.com/');
    this.socket.on('init', (msg) => console.log(msg));

    this.seed = null;
    this.code = null;
    this.previousSentState = {};
  }

  startNewGame() {
    this.socket.emit('createGame');
  }

  nextRound() {
    this.socket.emit('nextRound')
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