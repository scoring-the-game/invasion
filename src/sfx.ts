import die from '../sfx/die.mp3';
import hit from '../sfx/hit.mp3';
import shoot from '../sfx/shoot.mp3';
import introBackground from '../sfx/intro-background.mp3';
import mainBackground1 from '../sfx/main-background-1.mp3';
import mainBackground2 from '../sfx/main-background-2.mp3';
import mainBackground3 from '../sfx/main-background-3.mp3';
import levelCompletedBackground from '../sfx/level-completed-background.mp3';
import gameOverBackground from '../sfx/game-over-background.mp3';

const rawNames = [
  die,
  hit,
  shoot,
  introBackground,
  mainBackground1,
  mainBackground2,
  mainBackground3,
  levelCompletedBackground,
  gameOverBackground,
];

export const sfxNames = rawNames.map(rawName => rawName.slice(1).slice(0, -4));

export const sfxResources = sfxNames.map(name => ({ name, type: 'audio', src: '' }))

const nameReducer = (map, name) => {
  const key = name.split('.')[0];
  return { ...map, [key]: name };
};
export const mapSfx = sfxNames.reduce(nameReducer, {});
