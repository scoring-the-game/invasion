import { TitleScreen } from './title';
import { PlayScreen } from './play';
import { LevelCompletedScreen } from './levelCompleted';
import { GameOverScreen } from './gameOver';

export const enum ScreenTags {
  title = 'title',
  play = 'play',
  levelCompleted = 'level-completed',
  gameOver = 'game-over',
}

type TScreenTagMap = { [tag in ScreenTags]: any };

export let screenTagMap: TScreenTagMap;

export const createScreens = () => {
  screenTagMap = {
    [ScreenTags.title]: new TitleScreen(),
    [ScreenTags.play]: new PlayScreen(),
    [ScreenTags.levelCompleted]: new LevelCompletedScreen(),
    [ScreenTags.gameOver]: new GameOverScreen(),
  };
};

export const getScreen = (screenTag: ScreenTags): any => {
  return screenTagMap[screenTag];
};
