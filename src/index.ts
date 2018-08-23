import { me } from './me';
import { game } from './game';

window.game = game;
me.device.onReady(() => game.onload());
