// @flow
import express, { type $Request, type $Response } from 'express';
import path from 'path';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { redirAndLog } from './download';
import { handleGithubWebhook } from './github-webhook';

const { env: {
  API_PORT,
  API_ASSETS_URI,
  API_JONES_OAUTH_CLIENT_ID,
  API_JONES_OAUTH_CLIENT_SECRET,
  API_JONES_OAUTH_REDIR_URI,
} } = process;

const app = express();

app.use(bodyParser.json());

app.get('/', (req: $Request, res: $Response) => res.send('Beep ༼ つ ◕_◕ ༽つ Boop!'));

app.post('/github-webhook', handleGithubWebhook);

app.get('/download/:friend/:document/:edition/:filename', (req: $Request, res: $Response) => {
  const { params: { friend, document, edition, filename } } = req;
  const lang = 'en'; // @TODO infer from domain...?
  const basename = path.basename(filename);
  const [, format] = basename.split('.');

  const redirUri = [
    API_ASSETS_URI,
    lang,
    friend,
    document,
    edition,
    filename,
  ].join('/');

  redirAndLog(req, res, redirUri, {
    lang,
    friend,
    document,
    edition,
    format,
    context: 'web',
  });
});


app.get('/oauth/editor', (req: $Request, res: $Response) => {
  const code = ((req.query.code: any): string);
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
      res.redirect(302, `${API_JONES_OAUTH_REDIR_URI || ''}?access_token=${access_token}`);
    });
});


app.get('/podcast-item/:quality/:friend/:document/:edition/:part/:filename', (req: $Request, res: $Response) => {
  const { params: { quality, friend, document, edition, part, filename } } = req;
  const lang = 'en'; // @TODO infer from domain...?

  const redirUri = [
    API_ASSETS_URI,
    lang,
    friend,
    document,
    edition,
    filename,
  ].join('/');

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
});

app.listen(process.env.API_PORT, () => console.log(`Listening on ${API_PORT || ''}`));
