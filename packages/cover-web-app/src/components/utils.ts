import { CoverProps } from '@friends-library/types';
import { docDims } from '@friends-library/cover-component';
import { FriendData, DocumentData, EditionData } from '../types';
import { Mode } from './App';

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

export function fitScaler(
  props: CoverProps,
  fit: boolean,
  mode: Mode,
  showCode: boolean,
): number | undefined {
  if (!fit) {
    return WEB_SCALER;
  }

  const appChromeHeight = showCode ? 475 : 175;
  const dims = docDims(props.size, props.pages);
  const windowWidth = window.innerWidth / 96;
  const windowHeight = (window.innerHeight - appChromeHeight) / 96;
  const coverWidth = (mode === 'pdf' ? dims.pdfWidth : dims.width) * WEB_SCALER;
  const coverHeight = (mode === 'pdf' ? dims.pdfHeight : dims.height) * WEB_SCALER;
  if (coverWidth <= windowWidth && coverHeight <= windowHeight) {
    return WEB_SCALER;
  }

  const scale = Math.min(windowWidth / coverWidth, windowHeight / coverHeight);
  return WEB_SCALER * (scale - 0.019);
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

const LOREM_BLURB =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

export { LOREM_BLURB };

// I used to use this to match web app to prince pdf output
// not really sure if i need it anymore, or if it's still the right value
const WEB_SCALER = 1; //1.1358;
