import * as React from 'react';

export default {
  '/': () => ({
    props: {
      title: 'Home',
    },
    children: (
      <p>
        <a href="foo">Home is where the heart is</a>
        <br />
        <a href="nested/lol">Nessted lol</a>
      </p>
    )
  }),
  '/foo': () => ({
    props: {
      title: 'Foo',
    },
    children: <h1>Foo is foo.</h1>
  }),
  '/nested/lol': () => ({
    props: {
      title: 'N > Lol',
    },
    children: <h1>Lol ¯\_(ツ)_/¯</h1>
  }),
};
