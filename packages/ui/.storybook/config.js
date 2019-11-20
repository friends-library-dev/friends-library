import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useEnglish } from '../stories/decorators';
import Tailwind from '../src/Tailwind';

addDecorator(useEnglish);
addDecorator(storyFn => (
  <React.Fragment>
    <Tailwind />
    {storyFn()}
  </React.Fragment>
));

/* gatsby overrides */
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};
global.__PATH_PREFIX__ = '';
window.___navigate = pathname => {
  action('Navigate to:')(pathname);
};

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
