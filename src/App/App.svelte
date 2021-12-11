<script>
  import connectionHandler from '../ConnectionHandler';
  import ChooseType from './JoinOrCreate.svelte';
  import GetGameCode from './CreateNewGame.svelte';
  import Game from './Game.svelte';
  import { setContext } from 'svelte';


  let gameInitData = {};

  connectionHandler.socket.on('joined', ({playerNumber}) => gameInitData.playerNumber = playerNumber);
  connectionHandler.socket.on('gameInitialization', (data) => {
    gameInitData = {...gameInitData, ...data};
    console.log(gameInitData);
    route = 'game';
  });

  setContext('connectionHandler', {
    connectionHandler: connectionHandler,
  });

  let route = 'home';

  const changeRoute = (value) => (route = value);
</script>

<div id="content">
  {#if route === 'home'}
    <ChooseType {changeRoute} />
  {:else if route === 'create'}
    <GetGameCode {changeRoute} />
  {:else if route === 'game'}
    <Game {gameInitData} />
  {/if}
</div>

<style>
  :global(button) {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
  }

  :global(p) {
    font-size: 20px;
  }

  :global(h1) {
    font-size: 3rem;
    margin: 0.5rem 0;
  }

  :global(h2) {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }
</style>
