const fs = require('fs');
const path = `${__dirname}/src/components/Cover/Cover.css`;
const coverCss = fs.readFileSync(path, 'UTF-8');
module.exports = coverCss;
