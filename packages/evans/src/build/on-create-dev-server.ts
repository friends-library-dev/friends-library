import { eachEdition } from './helpers';
import { podcast } from '../lib/xml';
import { podcastUrl } from '../lib/url';

exports.onCreateDevServer = ({ app }: any) => {
  eachEdition(({ document, edition }) => {
    if (!edition.audio) {
      return;
    }
    app.get(podcastUrl(edition.audio), (req: any, res: any) => {
      res.type('application/xml');
      res.send(podcast(document, edition));
    });
  });
};
