import { CoverProps } from '@friends-library/types';
import { quotify } from '@friends-library/asciidoc';
import { FriendData, DocumentData, EditionData } from './Cover/types';
import { cssVars } from './Cover/css';

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
  threeD: boolean,
  showCode: boolean,
): number | undefined {
  const webScaler = 1.1358;
  if (!fit) {
    return webScaler;
  }

  let appChromeHeight = 175;
  if (showCode) appChromeHeight += 300;
  const vars = cssVars(props);
  const windowWidth = window.innerWidth / 96;
  const windowHeight = (window.innerHeight - appChromeHeight) / 96;
  const coverWidth = inchToNum(threeD ? vars.bookWidth : vars.coverWidth) * webScaler;
  const coverHeight = inchToNum(vars.coverHeight) * webScaler;
  if (coverWidth <= windowWidth && coverHeight <= windowHeight) {
    return webScaler;
  }

  const scale = Math.min(windowWidth / coverWidth, windowHeight / coverHeight);
  return webScaler * (scale - 0.015);
}

function inchToNum(val: string): number {
  return Number(val.replace(/in$/, ''));
}

export function documents(friendIndex: number): DocumentData[] {
  if (friendData[friendIndex]) {
    return friendData[friendIndex].documents;
  }
  return [];
}

export function prepareTitle(title: string, name: string): string {
  title = title.replace(/--/g, '–');
  title = title.replace(/ – Volumen? (?<number>(\d+|[IV]+))/, ', Vol.&nbsp;$<number>');
  return title.replace(name, name.replace(/ /g, '&nbsp;'));
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

export function formatBlurb(blurb: string): string {
  return quotify(blurb)
    .replace(/"`/g, '“')
    .replace(/`"/g, '”')
    .replace(/'`/g, '‘')
    .replace(/`'/g, '’')
    .replace(/--/g, '–');
}

const LOREM_BLURB =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

export { LOREM_BLURB };
