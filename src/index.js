import App from './App/App.svelte';
import 'modern-css-reset';
import './style.css';

import Game from "./Game";

//const game = new Game();

const app = new App({
  target: document.getElementById('container'),
});

export default app;