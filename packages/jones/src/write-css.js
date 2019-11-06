// @ts-check
const fs = require('fs');
const { genericPaperbackInterior: css } = require('@friends-library/doc-css');

fs.writeFileSync(`${__dirname}/../public/preview.css`, css());
