import { me } from '../me';
import { get as getScore } from '../score';
import { get as getLevel } from '../level';
import { mapSfx } from '../sfx';

const TextRenderable = me.Renderable.extend({
  // constructor
  init() {
    this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

    // font for the scrolling text
    this.font = new me.BitmapFont(
      me.loader.getBinary('PressStart2P'),
      me.loader.getImage('PressStart2P')
    );
  },

  update(dt) {
    return true;
  },

  draw(renderer) {
    const { width, height } = me.game.viewport;
    this.font.textAlign = 'center';
    this.font.draw(renderer, `LEVEL ${getLevel()} COMPLETED`, width, height - 50);
    this.font.draw(renderer, `CURRENT SCORE: ${getScore()}`, width, height);
    this.font.draw(renderer, 'PRESS ENTER TO CONTINUE', width, height + 100);
  },

  onDestroyEvent() {
  },
});

export const LevelCompletedScreen = me.ScreenObject.extend({
  // action to perform on state change
  onResetEvent() {
    me.audio.stopTrack(mapSfx['level-completed-background']);
    me.audio.playTrack(mapSfx['level-completed-background']);

    const image = me.loader.getImage('level_completed_screen');
    const backgroundImage = new me.Sprite(0, 0, { image });

    // position and scale to fit with the viewport size:
    const { viewport } = me.game;
    backgroundImage.anchorPoint.set(0, 0);
    backgroundImage.scale(
      viewport.width / backgroundImage.width,
      viewport.height / backgroundImage.height
    );

    me.game.world.addChild(backgroundImage, 1);
    me.game.world.addChild(new TextRenderable(), 2);

    // change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, 'enter', true);
    this.handler = me.event.subscribe(me.event.KEYDOWN, this.handleKeyDown);
  },

  handleKeyDown(action, keyCode, edge) {
    if (action === 'enter') {
      // play something on tap / enter
      // this will unlock audio on mobile devices
      // me.audio.play('cling');
      me.state.change(me.state.PLAY);
    }
  },

  // action to perform when leaving this screen (state change)
  onDestroyEvent() {
    me.audio.stopTrack('level-completed-background');
    me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
  },
});
