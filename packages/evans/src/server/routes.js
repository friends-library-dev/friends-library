import * as React from 'react';

export default {
  '/': () => ({
    props: {
      title: 'Home',
    },
    children: <a href="foo.html">Home is where the heart is</a>
  }),
  '/foo': () => ({
    props: {
      title: 'Foo',
    },
    children: <h1>Foo is foo.</h1>
  }),
};
