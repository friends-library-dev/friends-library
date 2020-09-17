import { eachEdition } from '@friends-library/friends';
import { GatsbyNode, CreateDevServerArgs } from 'gatsby';
import { podcast } from '../lib/xml';

const onCreateDevServer: GatsbyNode['onCreateDevServer'] = ({
  app,
}: CreateDevServerArgs) => {
  eachEdition(({ document, edition }) => {
    if (!edition.audio) {
      return;
    }
    app.get(edition.audio.podcastRelFilepath(`HQ`), (req: any, res: any) => {
      res.type(`application/xml`);
      res.send(podcast(document, edition, `HQ`));
    });
    app.get(edition.audio.podcastRelFilepath(`LQ`), (req: any, res: any) => {
      res.type(`application/xml`);
      res.send(podcast(document, edition, `LQ`));
    });
  });
};

export default onCreateDevServer;
