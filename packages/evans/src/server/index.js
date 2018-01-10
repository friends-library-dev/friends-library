import express from 'express';
import * as React from 'react';
import App from '../components/App';
import routes from './routes';
import { wrap } from './helpers';

const { env: { PORT } } = process;

const app = express();

app.get('/', (req, res) => {
  const { props, children } = routes['/']();
  res.send(wrap((
    <App {...props}>
      {children}
    </App>
  )));
});

app.get('/foo', (req, res) => {
  const { props, children } = routes['/foo']();
  res.send(wrap((
    <App {...props}>
      {children}
    </App>
  )));
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
