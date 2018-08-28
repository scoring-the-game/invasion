import { me } from './me';
import { game } from './game';

(window as any).game = game;
me.device.onReady(() => game.onload());
