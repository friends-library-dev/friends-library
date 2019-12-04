import fs from 'fs-extra';
import { eachEdition } from './helpers';
import { podcast } from '../lib/xml';
import { podcastUrl } from '../lib/url';

export default function onPostBuild(): void {
  eachEdition(({ document, edition }) => {
    if (edition.audio) {
      const xml = podcast(document, edition);
      fs.outputFileSync(`./public/${podcastUrl(edition.audio)}`, xml);
    }
  });
}
