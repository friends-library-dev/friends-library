import '@friends-library/client/load-env';
import express, { Request, Response } from 'express';
import path from 'path';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import { redirAndLog } from './download';
import { handleGithubWebhook } from './github-webhook';
import * as kiteJob from './kite-job';
import * as lint from './lint';
import legacy from './legacy';
import { requireEnv } from '@friends-library/types';

const {
  API_PORT,
  API_ASSETS_URI,
  API_JONES_OAUTH_CLIENT_ID,
  API_JONES_OAUTH_CLIENT_SECRET,
  API_JONES_OAUTH_REDIR_URI,
} = requireEnv(
  'API_PORT',
  'API_ASSETS_URI',
  'API_JONES_OAUTH_CLIENT_ID',
  'API_JONES_OAUTH_CLIENT_SECRET',
  'API_JONES_OAUTH_REDIR_URI',
);

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req: Request, res: Response) => res.send('Beep ༼ つ ◕_◕ ༽つ Boop!'));

app.post('/github-webhook', handleGithubWebhook);

app.use('/legacy', legacy);

app.post('/kite-jobs', kiteJob.create);
app.get('/kite-jobs', kiteJob.list);
app.get('/kite-jobs/take', kiteJob.take);
app.get('/kite-jobs/:id', kiteJob.get);
app.patch('/kite-jobs/:id', kiteJob.update);
app.delete('/kite-jobs/:id', kiteJob.destroy);

app.post('/lint/fix', cors(), lint.fix);
app.post('/lint/check', cors(), lint.check);
app.options('/lint/fix', cors(), (req: Request, res: Response) => {
  res.sendStatus(204);
});
app.options('/lint/check', cors(), (req: Request, res: Response) => {
  res.sendStatus(204);
});

app.get(
  '/download/:friend/:document/:edition/:filename',
  (req: Request, res: Response) => {
    const {
      params: { friend, document, edition, filename },
    } = req;
    const lang = 'en'; // @TODO infer from domain...?
    const basename = path.basename(filename);
    const [, format] = basename.split('.');

    const redirUri = [API_ASSETS_URI, lang, friend, document, edition, filename].join(
      '/',
    );

    redirAndLog(req, res, redirUri, {
      lang,
      friend,
      document,
      edition,
      format,
      context: 'web',
    });
  },
);

app.get('/oauth/editor', (req: Request, res: Response) => {
  const code = <string>req.query.code;
  const url = [
    'https://github.com/login/oauth/access_token',
    `?client_id=${API_JONES_OAUTH_CLIENT_ID || ''}`,
    `&client_secret=${API_JONES_OAUTH_CLIENT_SECRET || ''}`,
    `&code=${code}`,
  ].join('');

  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(r => r.json())
    .then(({ access_token }) => {
      res.redirect(
        302,
        `${API_JONES_OAUTH_REDIR_URI || ''}?access_token=${access_token}`,
      );
    });
});

app.get(
  '/podcast-item/:quality/:friend/:document/:edition/:part/:filename',
  (req: Request, res: Response) => {
    const {
      params: { quality, friend, document, edition, part, filename },
    } = req;

    const lang = 'en'; // @TODO infer from domain...?
    const uriParts = [API_ASSETS_URI, lang, friend, document, edition, filename];
    const redirUri = uriParts.join('/');

    redirAndLog(req, res, redirUri, {
      lang,
      friend,
      document,
      edition,
      quality,
      part: parseInt(part, 10),
      format: 'audio',
      context: 'podcast',
    });
  },
);

app.listen(process.env.API_PORT, () => console.log(`Listening on ${API_PORT || ''}`));
