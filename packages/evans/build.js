const axios = require('axios');
const fs = require('fs-extra');
const opn = require('opn');

(async () => {
  const response = await axios.get('http://localhost:3333');
  fs.outputFile('build/index.html', response.data);
  opn(`file:///${__dirname}/build/index.html`, { wait: false });
})();
