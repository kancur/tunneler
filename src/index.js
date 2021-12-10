import Game from "./Game";
import GameMap from "./map/GameMap";
import Render from "./render/Render";
import Viewport from "./Viewport";

const gameMap = new GameMap();
const viewport = new Viewport(gameMap);

const game = new Game();


