import { me } from '../me';
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
    this.font.draw(renderer, 'PRESS ENTER TO PLAY', width, height);
  },

  onDestroyEvent() {
  },
});

export const TitleScreen = me.ScreenObject.extend({
  // action to perform on state change
  onResetEvent() {
    me.audio.stopTrack(mapSfx['intro-background']);
    me.audio.playTrack(mapSfx['intro-background']);

    // title screen image:
    const image = me.loader.getImage('title_screen');
    const backgroundImage = new me.Sprite(0, 0, { image });

    // position and scale to fit with the viewport size:
    const { viewport } = me.game;
    backgroundImage.anchorPoint.set(0, 0);
    backgroundImage.scale(
      viewport.width / backgroundImage.width,
      viewport.height / backgroundImage.height
    );

    // add a new renderable component with the scrolling text
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
    me.audio.stopTrack('intro-background');

    me.input.unbindKey(me.input.KEY.ENTER);
    me.event.unsubscribe(this.handler);
  },
});
