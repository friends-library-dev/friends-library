import fs from 'fs-extra';
import { eachEdition } from './helpers';
import { podcast } from '../lib/xml';
import { podcastUrl } from '../lib/url';
import { GatsbyNode } from 'gatsby';

const onPostBuild: GatsbyNode['onPostBuild'] = () => {
  eachEdition(({ document, edition }) => {
    if (edition.audio) {
      const xmlHq = podcast(document, edition, 'HQ');
      fs.outputFileSync(`./public/${podcastUrl(edition.audio, 'HQ')}`, xmlHq);
      const xmlLq = podcast(document, edition, 'LQ');
      fs.outputFileSync(`./public/${podcastUrl(edition.audio, 'LQ')}`, xmlLq);
    }
  });
};

export default onPostBuild;
