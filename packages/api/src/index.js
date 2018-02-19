require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const uuid = require('uuid');
const useragent = require('express-useragent');

const { env: { PORT, NODE_ENV, ASSETS_URI, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } } = process;

const app = express();

app.get('/', (req, res) => res.send('Hello Jared!'));

app.get('/:lang/:friend/:doc/:edition/:filename', (req, res) => {
  const { params: { lang, friend, doc, edition, filename } } = req;
  const basename = path.basename(filename);
  const [name, format] = basename.split('.');

  const redirUri = [
    ASSETS_URI,
    lang,
    friend,
    doc,
    edition,
    `${name}--${edition}.${format}`,
  ].join('/');

  if (NODE_ENV !== 'development') {
    res.redirect(redirUri);
  } else {
    res.send(`<p>Redir to: <a href="${redirUri}">${redirUri}</a></p>`);
  }

  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
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
      ip_address: req.ip,
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
