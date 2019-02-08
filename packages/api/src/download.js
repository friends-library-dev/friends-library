const uuid = require('uuid');
const useragent = require('express-useragent');
const mysql = require('mysql');

const { env: {
  NODE_ENV,
  API_DB_HOST,
  API_DB_USER,
  API_DB_PASS,
  API_DB_NAME,
} } = process;

function getRow(req, data) {
  const ua = useragent.parse(req.headers['user-agent']);
  if (ua.isBot) {
    return null;
  }

  return {
    id: uuid.v4(),
    is_mobile: ua.isMobile,
    user_agent: ua.source,
    referrer: req.get('Referrer') || '',
    browser: ua.browser,
    os: ua.os,
    platform: ua.platform,
    ...data,
  };
}


function redirAndLog(req, res, uri, data) {
  if (NODE_ENV !== 'development') {
    res.redirect(uri);
  } else {
    res.send(`<p>Redir to: <a href="${uri}">${uri}</a></p>`);
  }

  const row = getRow(req, data);
  if (!row) {
    return;
  }

  const connection = mysql.createConnection({
    host: API_DB_HOST,
    user: API_DB_USER,
    password: API_DB_PASS,
    database: API_DB_NAME,
  });

  connection.connect((connectError) => {
    if (connectError) {
      // @TODO handle error (maybe send a slack?)
      console.error(connectError);
      return;
    }

    connection.query('INSERT INTO `downloads` SET ?', row, err => {
      if (err) {
        // @TODO handle error (maybe send a slack?)
        console.error(err);
      }
      connection.end();
    });
  });
}


module.exports = { redirAndLog };
