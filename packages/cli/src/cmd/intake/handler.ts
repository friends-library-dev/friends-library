import { query, hydrate } from '@friends-library/dpc-fs';
import { c, log } from '@friends-library/cli-utils/color';

export default function handler(): void {
  const dpcs = query.getByPattern();
  dpcs.forEach(dpc => {
    hydrate.asciidoc(dpc);
    const lines: string[] = [];
    const signs = dpc.asciidoc.split('\n').reduce((count: number, line: string) => {
      for (let regex of regexes) {
        if (regex.test(line)) {
          lines.push(line);
          return count + 1;
        }
      }
      return count;
    }, 0);
    const rate = dpc.asciidoc.split('\n').length / signs;
    if (rate > 650) {
      log(c`{yellow ${dpc.path}} {gray likely not intaken}`);
    }
  });
}

const regexes = [
  /^\[quote]$/,
  /^\[quote\.scripture.*]$/,
  /style-blurb/,
  /chapter-subtitle--blurb/,
  /short="/,
  /chapter-synopsis/,
  /\.alt\b/,
  /\.old-style/,
  /\.blurb/,
  /\.centered/,
  /^__Objection:__$/,
  /\.offset\b/,
  /\.salutation/,
  /\.signed-section/,
  /\.embedded-content-document/,
  /\.postscript/,
  /\.book-title/,
  /\.underline/,
  /\.numbered/,
  /\.emphasized/,
  /\.the-end/,
  /\.syllogism/,
  /::$/,
  /\.discourse-part/,
  /^\[verse.+]$/,
];
