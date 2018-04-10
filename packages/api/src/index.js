const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const express = require('express');
const mysql = require('mysql');
const uuid = require('uuid');
const useragent = require('express-useragent');

const { env: { PORT, NODE_ENV, ASSETS_URI, DB_HOST, DB_USER, DB_PASS, DB_NAME } } = process;

const app = express();

app.get('/', (req, res) => res.send(`Hello, Jared. Assets uri is: ${ASSETS_URI}`));

app.get('/download/:friend/:doc/:edition/:filename', (req, res) => {
  const { params: { friend, doc, edition, filename } } = req;
  const lang = 'en'; // @TODO infer from domain...?
  const basename = path.basename(filename);
  const [name, format] = basename.split('.');

  const redirUri = [
    ASSETS_URI,
    lang,
    friend,
    doc,
    edition,
    filename,
  ].join('/');

  if (NODE_ENV !== 'development') {
    res.redirect(redirUri);
  } else {
    res.send(`<p>Redir to: <a href="${redirUri}">${redirUri}</a></p>`);
  }

  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });

  connection.connect((connectError) => {
    if (connectError) {
      // @TODO handle error (maybe send a slack?)
      console.error(connectError);
      return;
    }

    const ua = useragent.parse(req.headers['user-agent']);
    if (ua.isBot) {
      return;
    }

    const row = {
      id: uuid.v4(),
      lang,
      friend,
      document: doc,
      edition,
      format,
      is_mobile: ua.isMobile,
      user_agent: ua.source,
      referrer: req.get('Referrer'),
      browser: ua.browser,
      os: ua.os,
      platform: ua.platform,
    };

    connection.query('INSERT INTO `downloads` SET ?', row, (err) => {
      if (err) {
        // @TODO handle error (maybe send a slack?)
        console.error(err);
      }
      connection.end();
    });
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
