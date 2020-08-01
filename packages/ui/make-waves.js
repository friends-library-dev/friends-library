// @ts-check
const fs = require('fs');
const colors = require('./tailwind.config.js').theme.extend.colors;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="350" viewBox="0 150 1800 490" preserveAspectRatio="none">
  <path
    fill="__COLOR__"
    d="__POINTS__"
  />
</svg>
`.trim();

// NOTE: to tweak the wave SVG paths/shape, go to this codepen: https://codepen.io/jaredh159/pen/yLNEgeg
// change stuff, and copy out the new point data. IMPORTANT: if you make changes to the SVG path that you
// end up keeping, change the initial state of the main React component, use the "Click to log state"
// button I added, and pull up the CodePen console to get a dump of the current state
const points =
  'M 0 270 Q 70 230 160 290 Q 235 340 295 260 Q 385 145 468 246 Q 530 320 597 267 Q 685 195 760 290 Q 820 360 880 295 Q 960 205 1045 275 Q 1105 325 1155 295 Q 1225 250 1295 300 Q 1355 340 1400 295 Q 1460 230 1545 270 Q 1635 310 1692 264 Q 1745 220 1800 235 L 1800 640 L 0 640 Z';

Object.keys(colors)
  .filter((c) => c.match(/^fl(blue|gold|maroon|green)-\d00$/))
  .forEach((name) => {
    const rgb = colors[name];
    const svgPath = `${__dirname}/src/images/waves/${name.replace(/^fl/, '')}.svg`;
    fs.writeFileSync(
      svgPath,
      svg.replace('__COLOR__', rgb).replace('__POINTS__', points),
    );
  });
