import { CoverProps } from '@friends-library/types';
import { docDims, pdfWidth, pdfHeight } from '@friends-library/cover-component';
import { FriendData, DocumentData, EditionData } from '../types';
import { Mode, Scale } from './App';

const friendData = (window as any).Friends as FriendData[];
export { friendData };

export function makePdf(props: CoverProps): void {
  fetch(`http://localhost:9988`, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });
}

export function scalerAndScope(
  size: CoverProps['size'],
  pages: CoverProps['pages'],
  scale: Scale,
  mode: Mode,
  showCode: boolean,
): Pick<CoverProps, 'scaler' | 'scope'> {
  switch (scale) {
    case '1':
      return {};
    case '1-2':
      return { scaler: 1 / 2, scope: scale };
    case '1-3':
      return { scaler: 1 / 3, scope: scale };
    case '1-4':
      return { scaler: 1 / 4, scope: scale };
    case '3-5':
      return { scaler: 3 / 5, scope: scale };
    case '4-5':
      return { scaler: 4 / 5, scope: scale };
    case 'fit':
      return { scaler: fitScaler(size, pages, mode, showCode) };
  }
}

function fitScaler(
  size: CoverProps['size'],
  pages: CoverProps['pages'],
  mode: Mode,
  showCode: boolean,
): number | undefined {
  const appChromeHeight = showCode ? 475 : 175;
  const dims = docDims(size);
  const windowWidth = window.innerWidth / 96;
  const windowHeight = (window.innerHeight - appChromeHeight) / 96;
  const coverWidth = mode === 'pdf' ? pdfWidth(size, pages) : dims.width;
  const coverHeight = mode === 'pdf' ? pdfHeight(size) : dims.height;
  if (coverWidth <= windowWidth && coverHeight <= windowHeight) {
    return 1;
  }

  const scale = Math.min(windowWidth / coverWidth, windowHeight / coverHeight);
  return scale - 0.019;
}

export function documents(friendIndex: number): DocumentData[] {
  if (friendData[friendIndex]) {
    return friendData[friendIndex].documents;
  }
  return [];
}

export function editions(friendIndex: number, docIndex: number): EditionData[] {
  if (!friendData[friendIndex]) {
    return [];
  }
  if (!friendData[friendIndex].documents[docIndex]) {
    return [];
  }
  return friendData[friendIndex].documents[docIndex].editions;
}
