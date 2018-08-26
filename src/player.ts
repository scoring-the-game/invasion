import { me } from './me';
// console.log('player =>', { me })
import { kLaserWidth, kLaserHeight } from './laser';
import { mapSfx } from './sfx';

export const Player = me.Sprite.extend({
  init() {
    // console.log('Player#init');
    var image = me.loader.getImage('player');

    const { width: wImage, height: hImage } = image;
    const { width: wViewport, height: hViewport } = me.game.viewport;
    const xPos = (wViewport - wImage) / 2;
    const yPos = hViewport - hImage - 20;

    this._super(me.Sprite, 'init', [xPos, yPos, { image }]);
    this.velx = 450;
    this.xMax = wViewport;
  },

  update(dt) {
    // console.log('Player#update');
    this._super(me.Sprite, 'update', [dt]);

    const dx = this.velx * dt / 1000;

    if (me.input.isKeyPressed('left')) {
      this.pos.x -= dx;
    }

    if (me.input.isKeyPressed('right')) {
      this.pos.x += dx;
    }

    if (me.input.isKeyPressed('shoot')) {
      me.audio.play(mapSfx.shoot);
      me.game.world.addChild(
        me.pool.pull('laser', this.pos.x - kLaserWidth + 2, this.pos.y - kLaserHeight)
      );
    }

    this.pos.x = this.pos.x.clamp(1, this.xMax);

    return true;
  },
});
