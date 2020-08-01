// @ts-check
const http = require('http');
const fs = require('fs');

http
  .createServer((req, res) => {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000,
      'Access-Control-Allow-Headers': '*',
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, cors);
      res.end();
      return;
    }

    let chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const json = JSON.parse(chunks.join(''));
      fs.writeFileSync(`${__dirname}/cover.json`, JSON.stringify(json, null, 2));
    });
    res.writeHead(201, cors);
    res.end();
  })
  .listen(9988, () => {
    console.log('PDF-Listener started on port 9988');
  });
