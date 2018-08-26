const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const express = require('express');
const { redirAndLog } =  require('./download');

const { env: { PORT, ASSETS_URI } } = process;

const app = express();

app.get('/', (req, res) => res.send(`Hello, Jared. Assets uri is: ${ASSETS_URI}`));

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
