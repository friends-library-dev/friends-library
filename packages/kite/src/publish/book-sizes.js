// @flow
import type { BookSize, BookSizeData } from '../type';

export const sizes: { [BookSize]: BookSizeData } = {
  'Pocket Book': {
    name: 'Pocket Book',
    size: 's',
    dims: {
      inches: {
        height: 6.875,
        width: 4.24,
      },
    },
  },
  Digest: {
    name: 'Digest',
    size: 'm',
    dims: {
      inches: {
        height: 8.5,
        width: 5.5,
      },
    },
  },
  A5: {
    name: 'A5',
    size: 'l',
    dims: {
      inches: {
        height: 8.27,
        width: 5.83,
      },
    },
  },
  'US Trade': {
    name: 'US Trade',
    size: 'xl',
    dims: {
      inches: {
        height: 9,
        width: 6,
      },
    },
  },
  'Crown Quarto': {
    name: 'Crown Quarto',
    size: 'xxl',
    dims: {
      inches: {
        height: 9.68,
        width: 7.44,
      },
    },
  },
};


export function getBookSize(id: string): ?BookSizeData {
  // $FlowFixMe
  return Object.values(sizes).filter(s => s.name === id || s.size === id)[0];
}
