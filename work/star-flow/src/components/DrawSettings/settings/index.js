import { LongPositionSettings } from './long-position';
import { ShortPositionSettings } from './short-position';

export const DRAW_SETTINGS = {
  long_position: {
    name: 'Long Position',
    component: LongPositionSettings,
  },
  short_position: {
    name: 'Short Position',
    component: ShortPositionSettings,
  },
};
