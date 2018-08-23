import player from '../media/img/player.png';
import ships from '../media/img/ships.png';

import imgTitleScreen from '../media/img/backgrounds/title-screen.png';
import imgLevelCompletedScreen from '../media/img/backgrounds/level-completed-screen.png';
import imgGameOverScreen from '../media/img/backgrounds/game-over-screen.png';

import imgPressStart2P from '/media/fnt/PressStart2P.png';
import fntPressStart2P from '/media/fnt/PressStart2P.fnt';

import { sfxResources } from './sfx';

export const resources = [
  { name: 'player', type: 'image', src: player },
  { name: 'ships', type: 'image', src: ships },
  { name: 'title_screen', type: 'image', src: imgTitleScreen },
  { name: 'level_completed_screen', type: 'image', src: imgLevelCompletedScreen },
  { name: 'game_over_screen', type: 'image', src: imgGameOverScreen },
  { name: 'PressStart2P', type: 'image', src: imgPressStart2P },
  { name: 'PressStart2P', type: 'binary', src: fntPressStart2P },
  ...sfxResources,
];
