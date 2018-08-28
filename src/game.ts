import { me } from './me';
// console.log('game =>', { me })
import { createScreens, getScreen, ScreenTags } from './screens';
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

  createScreens();
  me.state.set(me.state.MENU, getScreen(ScreenTags.title));
  me.state.set(me.state.PLAY, getScreen(ScreenTags.play));
  me.state.set(me.state.USER, getScreen(ScreenTags.levelCompleted));
  me.state.set(me.state.GAMEOVER, getScreen(ScreenTags.gameOver));

  // add our player entity in the entity pool
  me.pool.register('player', Player);
  me.pool.register('laser', Laser);
  me.pool.register('enemy', Enemy);

  // start the game
  me.state.change(me.state.MENU);
};


export const game = { onload, didLoad };
