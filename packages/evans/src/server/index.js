import express from 'express';
import React, { StrictMode } from 'react';
import App from 'components/App';
import routes from './routes';
import { wrap } from './helpers';

const { env: { PORT } } = process;

const app = express();

app.use(express.static('static'));

Object.keys(routes).forEach((route) => {
  app.get(route, (req, res) => {
    const { props, children } = routes[route](req, res);
    res.send(wrap(<StrictMode><App {...props}>{children}</App></StrictMode>));
  });
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
