import { PrintSize } from '@friends-library/types';

const defaultMargins = {
  top: 0.85,
  bottom: 0.65,
  outer: 0.6,
  inner: 0.7,
  runningHeadTop: 0.35,
};

export const sizes: { [key: string]: PrintSize } = {
  'Pocket Book': {
    name: 'Pocket Book',
    abbrev: 's',
    margins: {
      top: 0.68,
      bottom: 0.52,
      outer: 0.48,
      inner: 0.528,
      runningHeadTop: 0.18,
    },
    dims: {
      height: 6.875,
      width: 4.24,
    },
  },
  Digest: {
    name: 'Digest',
    abbrev: 'm',
    margins: defaultMargins,
    dims: {
      height: 8.5,
      width: 5.5,
    },
  },
  A5: {
    name: 'A5',
    abbrev: 'l',
    margins: defaultMargins,
    dims: {
      height: 8.27,
      width: 5.83,
    },
  },
  'US Trade': {
    name: 'US Trade',
    abbrev: 'xl',
    margins: defaultMargins,
    dims: {
      height: 9,
      width: 6,
    },
  },
  'Crown Quarto': {
    name: 'Crown Quarto',
    abbrev: 'xxl',
    margins: defaultMargins,
    dims: {
      height: 9.68,
      width: 7.44,
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
