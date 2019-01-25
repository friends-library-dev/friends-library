// @flow
import find from './find';
import type { Asciidoc } from '../../../type';
import type { MutationResolver, Finder } from './type';
import { mutateLine } from './mutate';

export default async function transform(
  adoc: Asciidoc,
  resolver: MutationResolver,
): Promise<Asciidoc> {
  const lines = adoc.split('\n');
  const finders = Object.values(find);
  for (let k = 0; k < finders.length; k++) {
    const finder = ((finders[k]: any): Finder);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const found = finder(line);
      const context = { lines, index: i };
      // eslint-disable-next-line no-await-in-loop
      const mutations = await resolver(line, found, context);
      lines[i] = mutateLine(line, mutations);
    }
  }
  return Promise.resolve(lines.join('\n'));
}
