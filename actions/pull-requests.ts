import fs from 'fs';
import { Sha } from '@friends-library/types';

export function number(): number | false {
  const { GITHUB_REF = '' } = process.env;
  const refMatch = /refs\/pull\/(\d+)\/merge/g.exec(GITHUB_REF);
  if (refMatch) {
    return Number(refMatch[1]);
  }

  const event = getEventJson();
  if (event?.pull_request?.number) {
    return Number(event.pull_request.number);
  }
  return false;
}

export function latestCommitSha(): Sha | false {
  const event = getEventJson();
  if (event?.pull_request?.head?.sha) {
    return String(event.pull_request.head.sha);
  }
  return false;
}

function getEventJson(): Record<string, any> {
  const { GITHUB_EVENT_PATH = '' } = process.env;
  const contents = fs.readFileSync(GITHUB_EVENT_PATH, 'utf8');
  console.log(JSON.stringify(JSON.parse(contents), null, 2));
  return JSON.parse(contents);
}
