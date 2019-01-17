const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const express = require('express');
const fetch = require('node-fetch');
const { redirAndLog } =  require('./download');

const { env: {
  PORT,
  ASSETS_URI,
  JONES_OAUTH_CLIENT_ID,
  JONES_OAUTH_CLIENT_SECRET,
  JONES_OAUTH_REDIR_URI,
} } = process;

const app = express();

app.get('/', (req, res) => res.send('AUTO ༼ つ ◕_◕ ༽つ DEPLOYED!'));

app.get('/download/:friend/:document/:edition/:filename', (req, res) => {
  const { params: { friend, document, edition, filename } } = req;
  const lang = 'en'; // @TODO infer from domain...?
  const basename = path.basename(filename);
  const [name, format] = basename.split('.');

  const redirUri = [
    ASSETS_URI,
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


app.get('/oauth/editor', (req, res) => {
  const url = [
    'https://github.com/login/oauth/access_token',
    `?client_id=${JONES_OAUTH_CLIENT_ID}`,
    `&client_secret=${JONES_OAUTH_CLIENT_SECRET}`,
    `&code=${req.query.code}`,
  ].join('');

  fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(r => r.json())
    .then(({ access_token }) => {
      res.redirect(302, `${JONES_OAUTH_REDIR_URI}?access_token=${access_token}`);
    });
});


app.get('/podcast-item/:quality/:friend/:document/:edition/:part/:filename', (req, res) => {
  const { params: { quality, friend, document, edition, part, filename } } = req;
  const lang = 'en'; // @TODO infer from domain...?
  const basename = path.basename(filename);

  const redirUri = [
    ASSETS_URI,
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

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
