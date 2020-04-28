import { query, hydrate } from '@friends-library/dpc-fs';
import { c, log } from '@friends-library/cli-utils/color';

export default function handler(): void {
  let err = false;
  query.getByPattern().forEach(dpc => {
    hydrate.entities(dpc);
    hydrate.asciidoc(dpc);
    if (!dpc.edition) {
      throw new Error('Missing dpc edition entity');
    }

    // temp: half-published william sewel
    if (dpc.edition.path.includes('en/william-sewel/history')) {
      return;
    }

    const signsOfIntake = dpc.asciidoc
      .split('\n')
      .reduce((count: number, line: string) => {
        for (const regex of regexes) {
          if (regex.test(line)) {
            return count + 1;
          }
        }
        return count;
      }, 0);

    const rate = dpc.asciidoc.split('\n').length / signsOfIntake;

    if (rate > 650 && dpc.edition.isDraft === false) {
      log(c`{yellow ${dpc.path}} {gray likely not intaken}`);
      err = true;
    }
  });

  if (err) {
    process.exit(1);
  }

  log(c`👍  {green All editions complete or correctly marked as draft.}`);
}

const regexes = [
  /^\[quote]$/,
  /^\[quote\.scripture.*]$/,
  /^____$/,
  /style-blurb/,
  /chapter-subtitle--blurb/,
  /short="/,
  /chapter-synopsis/,
  /\.alt\b/,
  /\.old-style/,
  /\.blurb/,
  /^\[\.asterism\]$/,
  /^\[\.small-break\]$/,
  /^'''$/,
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
