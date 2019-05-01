import { CoverProps, FriendData } from './Cover/types';
import { cssVars } from './Cover/css';

type Friend = FriendData[0];
type Document = Friend['documents'][0];
type Edition = Document['editions'][0];

const friendData = (window as any).Friends as FriendData;
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

export function fitScaler(props: CoverProps, fit: boolean): number | undefined {
  const webScaler = 1.1358;
  if (!fit) {
    return webScaler;
  }

  const windowWidth = window.innerWidth / 96;
  const coverWidth = Number(cssVars(props).coverWidth.replace(/in$/, '')) * webScaler;
  if (coverWidth <= windowWidth) {
    return webScaler;
  }

  const shrinker = windowWidth / coverWidth - 0.015;
  return webScaler * shrinker;
}

export function documents(friendIndex: number): Document[] {
  if (friendData[friendIndex]) {
    return friendData[friendIndex].documents;
  }
  return [];
}

export function editions(friendIndex: number, docIndex: number): Edition[] {
  if (!friendData[friendIndex]) {
    return [];
  }
  if (!friendData[friendIndex].documents[docIndex]) {
    return [];
  }
  return friendData[friendIndex].documents[docIndex].editions;
}

export function blurb(doc: Document, friend: Friend): string {
  let blurb = doc.description || friend.description;
  if (blurb !== 'TODO') return blurb;
  return `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;
}
