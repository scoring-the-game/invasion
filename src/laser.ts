import { me } from './me';
import { increment as incrementScore, get as getScore } from './score';
import { mapSfx } from './sfx';

export const kLaserWidth = 5;
export const kLaserHeight = 28;

export const Laser = me.Entity.extend({
  init(x, y) {
    // console.log('Laser#init');
    this._super(me.Entity, 'init', [x, y, { width: kLaserWidth, height: kLaserHeight }]);
    this.z = 5;
    this.body.setVelocity(0, 100);
    this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
    this.renderable = new (me.Renderable.extend({
      init() {
        this._super(me.Renderable, 'init', [0, 0, kLaserWidth, kLaserHeight]);
      },
      destroy() {},
      draw(renderer) {
        var color = renderer.getColor();
        renderer.setColor('#5EFF7E');
        renderer.fillRect(0, 0, this.width, this.height);
        renderer.setColor(color);
      },
    }))();
    this.alwaysUpdate = true;
  },

  onCollision(res, other) {
    // console.log('Laser#onCollision');
    if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      me.audio.play(mapSfx['hit']);
      incrementScore();
      me.game.world.removeChild(this);
      window.game.playScreen.enemyManager.removeChild(other);
      return true;
    }
  },

  update(time) {
    // console.log('Laser#update');
    this.body.vel.y -= this.body.accel.y * time / 1000;
    if (this.pos.y + this.height <= 0) {
      me.game.world.removeChild(this);
    }

    this.body.update();
    me.collision.check(this);

    return true;
  },
});

