import express from 'express';
import React, { StrictMode } from 'react';
import { PORT } from 'env';
import App from 'components/App';
import { podcast } from 'lib/xml';
import routes from './routes';
import { wrap, query } from './helpers';

const app = express();

app.use(express.static('static'));

Object.keys(routes).forEach((route) => {
  app.get(route, (req, res) => {
    const { props, children } = routes[route](req, res);
    res.send(wrap(<StrictMode><App {...props}>{children}</App></StrictMode>));
  });
});

app.get('/:friendSlug/:docSlug/:editionType/podcast', (req, res) => {
  const { params: { friendSlug, docSlug, editionType } } = req;
  const { document, edition } = query(friendSlug, docSlug, editionType);
  res.set('Content-type', 'application/rss+xml');
  res.send(podcast(document, edition));
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
