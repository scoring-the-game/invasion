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
    this.font.draw(renderer, 'GAME OVER', width, height - 100);
    this.font.draw(renderer, `LEVELS COMPLETED: ${getLevel()}`, width, height);
    this.font.draw(renderer, `FINAL SCORE: ${getScore()}`, width, height + 50);
  },

  onDestroyEvent() {
    //just in case
    // this.scrollertween.stop();
  },
});

export const GameOverScreen = me.ScreenObject.extend({
  // action to perform on state change
  onResetEvent() {
    me.audio.stopTrack(mapSfx['game-over-background']);
    me.audio.playTrack(mapSfx['game-over-background']);

    const image = me.loader.getImage('game_over_screen');
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
  },

  // action to perform when leaving this screen (state change)
  onDestroyEvent() {
    me.audio.stopTrack('game-over-background');
  },
});
