<script>
  import { getContext } from 'svelte';
  const { connectionHandler } = getContext('connectionHandler');
  export let changeRoute;

  let gameCode;
  
  function createGame() {
    changeRoute('create');
  }

  function handleInput() {
    connectionHandler.socket.emit('gameCodeInput', gameCode)
  }

</script>

<div id="form">
  <h1>Let's play Tunneler</h1>
  <p>Connect to a friend using a code</p>
  <input bind:value={gameCode} on:input={handleInput} type="text" id="code" placeholder="abc123" />
  <p>Or create a new game</p>
  <button on:click={createGame}>Create a new game</button>
</div>

<style>
  input {
    font-size: 1.5rem;
    max-width: 200px;
    text-align: center;
  }

  input:focus {
    outline: none;
  }

  #form {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    align-items: center;
    background-color: #375284;
    padding: 1rem;
  }
</style>
