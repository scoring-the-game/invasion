import { me } from '../../lib/melonjs';
import { EnemyManager } from '../enemy_manager';
import { increment as incrementLevel, get as getLevel } from '../level';
import { get as getScore } from '../score';
import { mapSfx } from '../sfx';

const TextRenderable = me.Renderable.extend({
  // constructor
  init() {
    const { width } = me.game.viewport;
    this._super(me.Renderable, 'init', [0, 0, width, 40]);

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

const RectRenderable = me.Renderable.extend({
  init() {
    const { width, height } = me.game.viewport;
    // position, width, height
    this._super(me.Renderable, 'init', [0, height - 4, 2 * width, 50]);
  },

  update() {
    return true;
  },

  draw(renderer) {
    renderer.setColor('#003');
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
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
      me.timer.setTimeout(() => me.state.change(me.state.GAMEOVER), 750);
    }
  },

  //  action to perform on state change
  onResetEvent() {
    // console.log('PlayScreen#onResetEvent');
    stopAudio();
    startAudioForLevel(getLevel());

    incrementLevel();

    me.input.bindKey(me.input.KEY.LEFT, 'left');
    me.input.bindKey(me.input.KEY.RIGHT, 'right');
    me.input.bindKey(me.input.KEY.A, 'left');
    me.input.bindKey(me.input.KEY.D, 'right');
    me.input.bindKey(me.input.KEY.SPACE, 'shoot', true);

    this.player = me.pool.pull('player');
    this.enemyManager = new EnemyManager();
    this.enemyManager.createEnemies();

    const { world } = me.game;
    let iChild = 0;
    world.addChild(new me.ColorLayer('background', '#171717'), iChild++);
    world.addChild(new RectRenderable(), iChild++);
    world.addChild(new TextRenderable(), iChild++);
    world.addChild(this.player, iChild++);
    world.addChild(this.enemyManager, iChild++);
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
