// @flow
import type { PrintSizeName, PrintSize } from '../type';

export const sizes: { [PrintSizeName]: PrintSize } = {
  'Pocket Book': {
    name: 'Pocket Book',
    abbrev: 's',
    dims: {
      inches: {
        height: 6.875,
        width: 4.24,
      },
    },
  },
  Digest: {
    name: 'Digest',
    abbrev: 'm',
    dims: {
      inches: {
        height: 8.5,
        width: 5.5,
      },
    },
  },
  A5: {
    name: 'A5',
    abbrev: 'l',
    dims: {
      inches: {
        height: 8.27,
        width: 5.83,
      },
    },
  },
  'US Trade': {
    name: 'US Trade',
    abbrev: 'xl',
    dims: {
      inches: {
        height: 9,
        width: 6,
      },
    },
  },
  'Crown Quarto': {
    name: 'Crown Quarto',
    abbrev: 'xxl',
    dims: {
      inches: {
        height: 9.68,
        width: 7.44,
      },
    },
  },
};


export function getBookSize(id: string): PrintSize {
  let size;

  Object.values(sizes).forEach(s => {
    if (s && (s.name === id || s.abbrev === id)) {
      size = s;
    }
  });

  if (!size) {
    throw new Error(`Unknown print size identifier: "${id}"`);
  }

  return size;
}
