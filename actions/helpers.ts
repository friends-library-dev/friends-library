import fs from 'fs';
import { Sha } from '@friends-library/types';

export function newOrModifiedFiles(): string[] {
  const { HOME = `` } = process.env;
  const all: string[] = JSON.parse(fs.readFileSync(`${HOME}/files.json`, `utf8`));
  const rm: string[] = JSON.parse(fs.readFileSync(`${HOME}/files_removed.json`, `utf8`));
  return all
    .filter((file) => file.endsWith(`.adoc`))
    .filter((file) => !rm.includes(file));
}

/**
 * Get the most recent commit sha for the github triggering event.
 *
 * Retrieval method was carefully tested and ensures the right commit
 * when opening and syncing a pull request, AND when merging (ANY merge type)
 * works for `push` and `pull_request.*` events
 */
export function latestCommitSha(): Sha | void {
  // prefer `event.pull_request.head.sha` -- works for all pull_request.* events
  const event = getEventJson();
  if (event?.pull_request?.head?.sha) {
    return String(event.pull_request.head.sha);
  }
  // otherwise, the `GITHUB_SHA` env var will be correct
  return process.env.GITHUB_SHA;
}

export function getEventJson(): Record<string, any> {
  const { GITHUB_EVENT_PATH = `` } = process.env;
  const contents = fs.readFileSync(GITHUB_EVENT_PATH, `utf8`);
  return JSON.parse(contents);
}
