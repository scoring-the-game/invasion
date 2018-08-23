import { me } from '../../lib/melonjs';
import { EnemyManager } from '../enemy_manager';
import { increment as incrementLevel, get as getLevel } from '../level';
import { get as getScore } from '../score';
import { mapSfx } from '../sfx';

const TextRenderable = me.Renderable.extend({
  // constructor
  init() {
    this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, 50]);

    // font for the scrolling text
    this.font = new me.BitmapFont(
      me.loader.getBinary('PressStart2P'),
      me.loader.getImage('PressStart2P')
    );
    this.font.resize(0.67);
  },

  update(dt) {
    return true;
  },

  draw(renderer) {
    const { width, height } = me.game.viewport;
    this.font.textAlign = 'center';
    this.font.draw(renderer, `[ LEVEL: ${getLevel()} - SCORE: ${getScore()} ]`, width, height);
  },
});

const stopAudio = () => {
  me.audio.stopTrack('main-background-1');
  me.audio.stopTrack('main-background-2');
  me.audio.stopTrack('main-background-3');
};

const startAudioForLevel = level => {
  const track =
    level === 0 ? 'main-background-1' : level === 1 ? 'main-background-2' : 'main-background-3';
  me.audio.playTrack(mapSfx[track]);
};

export const PlayScreen = me.ScreenObject.extend({
  checkIfLoss(y) {
    // console.log('PlayScreen#checkIfLoss');
    if (y >= this.player.pos.y) {
      me.audio.play(mapSfx.die);
      setTimeout(() => me.state.change(me.state.GAMEOVER), 750);
    }
  },

  //  action to perform on state change
  onResetEvent() {
    // console.log('PlayScreen#onResetEvent');
    stopAudio();
    startAudioForLevel(getLevel());

    incrementLevel();

    me.game.world.addChild(new me.ColorLayer('background', '#171717'), 0);
    this.player = me.pool.pull('player');
    me.game.world.addChild(this.player, 1);

    me.input.bindKey(me.input.KEY.LEFT, 'left');
    me.input.bindKey(me.input.KEY.RIGHT, 'right');
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.SPACE, 'shoot', true);

    this.enemyManager = new EnemyManager();
    this.enemyManager.createEnemies();
    me.game.world.addChild(this.enemyManager, 2);

    me.game.world.addChild(new TextRenderable(), 3);
  },

  //  action to perform when leaving this screen (state change)
  onDestroyEvent() {
    // console.log('PlayScreen#onDestroyEvent');
    stopAudio();
    me.input.unbindKey(me.input.KEY.LEFT);
    me.input.unbindKey(me.input.KEY.RIGHT);
    me.input.unbindKey(me.input.KEY.A);
    me.input.unbindKey(me.input.KEY.D);
    me.input.unbindKey(me.input.KEY.SPACE);
  },
});
