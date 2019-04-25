// @ts-check
const http = require('http');
const fs = require('fs');

http
  .createServer((req, res) => {
    let chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const json = JSON.parse(chunks.join(''));
      fs.writeFileSync(`${__dirname}/cover.json`, JSON.stringify(json, null, 2));
    });
    res.writeHead(201);
    res.end();
  })
  .listen(9988, () => {
    console.log('PDF-Listener started on port 9988');
  });
