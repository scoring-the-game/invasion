import { me } from './me';
// console.log('game =>', { me })
import { TitleScreen } from './screens/title';
import { PlayScreen } from './screens/play';
import { LevelCompletedScreen } from './screens/levelCompleted';
import { GameOverScreen } from './screens/gameOver';
import { Enemy } from './enemy';
import { Player } from './player';
import { Laser } from './laser';
import { resources } from './resources';

const onload = () => {
  // console.log('Game#onload');

  // Initialize the video.
  const videoProps = {
    wrapper: 'screen',
    scale: 'auto',
    scaleMethod: 'fit',
    doubleBuffering: true,
  }
  if (!me.video.init(640, 480, videoProps)) {
    alert('Your browser does not support HTML5 canvas.');
    return;
  }

  // add "#debug" to the URL to enable the debug Panel
  if (me.game.HASH.debug === true) {
    window.onReady(() => me.plugin.register.defer(game, me.debug.Panel, 'debug', me.input.KEY.V));
  }

  // Initialize the audio.
  me.audio.init('mp3,wav');

  // Set a callback to run when loading is complete.
  me.loader.onload = didLoad;

  // Load the resources.
  me.loader.preload(resources);

  // Initialize melonJS and display a loading screen.
  me.state.change(me.state.LOADING);
};

const didLoad = () => {
  // console.log('Game#loaded');

  // set the "Play/Ingame" Screen Object
  const titleScreen = new TitleScreen();
  me.state.set(me.state.MENU, titleScreen);
  window.game.titleScreen = titleScreen;

  const playScreen = new PlayScreen();
  me.state.set(me.state.PLAY, playScreen);
  window.game.playScreen = playScreen;

  const levelCompletedScreen = new LevelCompletedScreen();
  me.state.set(me.state.USER, levelCompletedScreen);
  window.game.levelCompletedScreen = levelCompletedScreen;

  const gameOverScreen = new GameOverScreen();
  me.state.set(me.state.GAMEOVER, gameOverScreen);
  window.game.gameOverScreen = gameOverScreen;

  // add our player entity in the entity pool
  me.pool.register('player', Player);
  me.pool.register('laser', Laser);
  me.pool.register('enemy', Enemy);

  // start the game
  me.state.change(me.state.MENU);
};


export const game = { onload, didLoad };
