import fs from 'fs-extra';
import { eachFormat } from './helpers';
import { podcast } from '../lib/xml';

export default function onPostBuild(): void {
  eachFormat(({ format, document, edition }) => {
    if (format.type === 'audio') {
      const xml = podcast(document, edition);
      fs.outputFileSync(`./public/${document.url()}/${edition.type}/podcast.rss`, xml);
    }
  });
}
