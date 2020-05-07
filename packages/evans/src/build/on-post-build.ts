import fs from 'fs-extra';
import { GatsbyNode } from 'gatsby';
import env from '@friends-library/env';
import { eachEdition } from './helpers';
import { podcast } from '../lib/xml';
import { sendSearchDataToAlgolia } from './algolia';

const onPostBuild: GatsbyNode['onPostBuild'] = async () => {
  eachEdition(({ document, edition }) => {
    if (edition.audio) {
      const xmlHq = podcast(document, edition, 'HQ');
      fs.outputFileSync(`./public/${edition.audio.podcastRelFilepath('HQ')}`, xmlHq);
      const xmlLq = podcast(document, edition, 'LQ');
      fs.outputFileSync(`./public/${edition.audio.podcastRelFilepath('LQ')}`, xmlLq);
    }
  });

  const { GATSBY_NETLIFY_CONTEXT, DEPLOYING } = env.get(
    'GATSBY_NETLIFY_CONTEXT',
    'DEPLOYING',
  );
  if (DEPLOYING && GATSBY_NETLIFY_CONTEXT === 'production') {
    await sendSearchDataToAlgolia();
  }
};

export default onPostBuild;
