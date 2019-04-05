import { eachFormat } from './helpers';
import { podcast } from '../lib/xml';

exports.onCreateDevServer = ({ app }: any) => {
  eachFormat(({ document, edition, format }) => {
    if (format.type === 'audio') {
      app.get(edition.audio!.url(), (req: any, res: any) => {
        res.type('application/xml');
        res.send(podcast(document, edition));
      });
    }
  });
};
