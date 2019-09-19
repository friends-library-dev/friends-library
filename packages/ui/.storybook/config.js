import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { useEnglish } from '../stories/locale';
import Tailwind from '../src/Tailwind';

addDecorator(useEnglish);
addDecorator(storyFn => (
  <React.Fragment>
    <Tailwind />
    {storyFn()}
  </React.Fragment>
));

// @see: https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/defaults.ts
if (process.env.STORYBOOK_VIEWPORT) {
  addParameters({
    viewport: {
      defaultViewport: process.env.STORYBOOK_VIEWPORT,
      viewports: {
        responsive: {
          name: 'Responsive',
          styles: {
            width: '95%',
            height: '95%',
          },
        },
        ...INITIAL_VIEWPORTS,
      },
    },
  });
}

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
