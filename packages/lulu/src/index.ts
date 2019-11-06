import { PrintSize, PrintSizeDetails, PageData } from '@friends-library/types';

const defaultMargins = {
  top: 0.85,
  bottom: 0.65,
  outer: 0.6,
  inner: 0.7,
  runningHeadTop: 0.35,
};

export const sizes: { [K in PrintSize]: PrintSizeDetails } = {
  s: {
    luluName: 'Pocket Book',
    abbrev: 's',
    minPages: 2,
    maxPages: 175,
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
  m: {
    minPages: 100,
    maxPages: 450,
    luluName: 'Digest',
    abbrev: 'm',
    margins: defaultMargins,
    dims: {
      height: 8.5,
      width: 5.5,
    },
  },
  xl: {
    minPages: 350,
    maxPages: 800,
    luluName: 'US Trade',
    abbrev: 'xl',
    margins: defaultMargins,
    dims: {
      height: 9,
      width: 6,
    },
  },
};

export function getPrintSizeDetails(id: string): PrintSizeDetails {
  let size;

  Object.values(sizes).forEach(s => {
    if (s && (s.luluName === id || s.abbrev === id)) {
      size = s;
    }
  });

  if (!size) {
    throw new Error(`Unknown print size identifier: "${id}"`);
  }

  return size;
}

export function choosePrintSize(
  singlePages: PageData['single'],
  splitPages: PageData['split'],
): [PrintSize, boolean] {
  if (splitPages) {
    const numVols = splitPages.m.length;
    const average = {
      s: Infinity,
      m: splitPages.m.reduce(add) / numVols,
      xl: splitPages.xl.reduce(add) / numVols,
      'xl--condensed': splitPages['xl--condensed'].reduce(add) / numVols,
    };
    return choosePrintSize(average, undefined);
  }

  let printSize: PrintSize = 's';
  let condense = false;

  if (singlePages.s <= sizes.s.maxPages) {
    return [printSize, condense];
  }

  printSize = 'm';
  if (singlePages.m <= sizes.m.maxPages) {
    return [printSize, condense];
  }

  printSize = 'xl';
  if (singlePages.xl > CONDENSE_THRESHOLD) {
    return [printSize, true];
  }

  return ['xl', false];
}

const CONDENSE_THRESHOLD = 600;

function add(a: number, b: number): number {
  return a + b;
}
