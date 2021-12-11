<script>
  export let gameInitData
  import Game from '../Game';
  import { getContext } from 'svelte';
  import { onMount } from 'svelte';

  const { connectionHandler } = getContext('connectionHandler');

  function startGame() {
    console.log('starting game with data',gameInitData)
    const game = new Game(gameInitData.seed, gameInitData.players, gameInitData.playerNumber)
  }

  onMount(async () => {
    startGame();
	});
</script>

<canvas />
