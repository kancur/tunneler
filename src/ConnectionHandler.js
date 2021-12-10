const { io } = require("socket.io-client");

export default class ConnectionHandler {
  constructor() {
    this.socket = io("http://localhost:3100");
    this.socket.on('init', this.handleInit)
    //this.socket.on('gamestate', this.handleGameState)
  }

  handleInit(data) {
    console.log(data)
  }

    
}


