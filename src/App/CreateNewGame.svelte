<script>
  export let changeRoute;
  import { getContext } from 'svelte';
  const { connectionHandler } = getContext('connectionHandler');
  let code = '';
  let seed = '';
  //connectionHandler.socket.on('gameInfo', handleGameInit);
  connectionHandler.startNewGame();
  connectionHandler.socket.on('gameCode', (gameCode) => {
      code = gameCode;
    });

  function handleGameInit(data) {
    code = data.code;
    seed = data.seed;
    console.log(data);
  }

  const goHome = () => changeRoute('home');
</script>

<div id="create-new-game">
  <h1>Game ready!</h1>
  <h2>Send this code to your friend</h2>
  <p id="code">{code}</p>
  <p>The game will start automatically once your friend connects</p>
  <button on:click={goHome}>Exit game</button>
</div>

<style>
  #create-new-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  #code {
    width: 210px;
    height: 80px;
    text-align: center;
    font-size: 2rem;
    padding: 1rem 2rem;
    background-color: #00000088;
  }

  button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
  }
</style>
