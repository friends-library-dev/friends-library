import { NewsFeedType } from '@friends-library/types';
import { LANG } from '../../../env';

export const COLOR_MAP: { [k in NewsFeedType]: string } = {
  book: `flblue`,
  spanish_translation: LANG === `en` ? `flgold` : `flmaroon`,
  feature: `flgreen`,
  chapter: `flgold`,
  audiobook: `flmaroon`,
};
