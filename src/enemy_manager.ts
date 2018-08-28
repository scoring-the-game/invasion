import { me } from './me';
import { get as getLevel } from './level';
import { getScreen, ScreenTags } from './screens';

const kNumRows = 4;
const kNumCols = 9;

const kIntervalInitial = 1000;
const kIntervalMin = 100;
const kIntervalFactor = 0.8;

const intervals = [1000, 750, 500, 350, 250, 200, 200, 150, 150, 150, 100];
const nIntervals = intervals.length;

const calcInterval = level => {
  const index = Math.min(level, nIntervals);
  return intervals[index - 1];
};

export const EnemyManager = me.Container.extend({
  init() {
    // console.log('EnemyManager#init');
    this._super(me.Container, 'init', [0, 32, this.nCols * 64 - 32, this.nRows * 64 - 32]);
    this.nCols = kNumCols;
    this.nRows = kNumRows;
    this.vel = 16;

    const millisInterval = calcInterval(getLevel());
    // console.log('EnemyManager#init =>', { millisInterval });
    this.millisInterval = millisInterval;
  },

  createEnemies() {
    // console.log('EnemyManager#createEnemies =>', this.millisInterval);
    for (var iCol = 0; iCol < kNumCols; iCol++) {
      for (var iRow = 0; iRow < kNumRows; iRow++) {
        this.addChild(me.pool.pull('enemy', iCol * 64, iRow * 64));
      }
    }
    this.didCreateEnemies = true;
    this.updateChildBounds();
  },

  tick() {
    var bounds = this.childBounds;

    if (
      (this.vel > 0 && bounds.right + this.vel >= me.game.viewport.width) ||
      (this.vel < 0 && bounds.left + this.vel <= 0)
    ) {
      this.pos.y += 16;
      this.vel *= -1;
      this.vel += 5 * (this.vel > 0 ? 1 : -1);
      const playScreen = getScreen(ScreenTags.play);
      playScreen.checkIfLoss(bounds.bottom);
    } else {
      this.pos.x += this.vel;
    }
    this.triggerTimer();
  },

  triggerTimer() {
    this.timer = me.timer.setTimeout(() => this.tick(), this.millisInterval);
  },

  clearTimer() {
    if (this.timer) {
      me.timer.clearTimeout(this.timer);
      this.timer = null;
    }
  },

  onActivateEvent() {
    this.triggerTimer();
  },

  onDeactivateEvent() {
    this.clearTimer();
  },

  removeChildNow(child) {
    this._super(me.Container, 'removeChildNow', [child]);
    this.updateChildBounds();
  },

  update(time) {
    if (this.children.length === 0 && this.didCreateEnemies) {
      me.timer.setTimeout(() => me.state.change(me.state.USER), 750);
    }
    this._super(me.Container, 'update', [time]);
    this.updateChildBounds();
  },
});
