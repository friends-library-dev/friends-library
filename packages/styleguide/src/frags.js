// @flow
// $FlowFixMe
import frags from '../dist/frags.json'; // eslint-disable-line import/no-unresolved

export function html(id: string): string {
  return frags[id].html || '';
}

export function adoc(id: string): string {
  return frags[id].adoc || '';
}
