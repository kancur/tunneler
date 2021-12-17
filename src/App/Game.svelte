<script>
  export let gameInitData
  import Game from '../Game';
  import { getContext } from 'svelte';
  import { onMount } from 'svelte';

  const { connectionHandler } = getContext('connectionHandler');

  function startGame() {
    const game = new Game(gameInitData.seed, gameInitData.players, gameInitData.playerNumber)
  }

  onMount(async () => {
    startGame();
	});
</script>

<canvas id="gamecanvas"/>

<style>
  #gamecanvas {
    width: 500px;
  }
</style>