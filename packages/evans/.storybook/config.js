// @flow
/* eslint-disable global-require */
import { configure } from '@storybook/react';

function loadStories() {
  require('./stories/index');
}

configure(loadStories, module);
