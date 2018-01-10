import express from 'express';
import * as React from 'react';
import ReactDOM from 'react-dom/server';
import { renderStaticOptimized } from 'glamor/server';
import App from '../components/App';

const { env: { NODE_ENV, PORT } } = process;

const app = express();

const wrap = (Component) => {
  const { html, css } = renderStaticOptimized(() => {
    return ReactDOM.renderToStaticMarkup(Component);
  });

  let markup = `<!doctype html>${html}`

  markup = markup.replace('</head>', `<style>${css}</style></head>`);

  if (NODE_ENV === 'development') {
    const bsUri = 'http://localhost:2223/browser-sync/browser-sync-client.js?v=2.23.3';
    markup = markup.replace(
      '</body>',
      `<script async src="${bsUri}"></script></body>`,
    );
  }

  return markup;
}

app.get('/', (req, res) => res.send(wrap(<App />)));

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
