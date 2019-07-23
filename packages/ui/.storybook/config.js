import { configure } from '@storybook/react';

/* gatsby overrides */
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};
global.__PATH_PREFIX__ = '';
window.___navigate = pathname => {
  action('NavigateTo:')(pathname);
};

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
