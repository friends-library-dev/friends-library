import { Handler, APIGatewayEvent } from 'aws-lambda';
import env from '@friends-library/env';
import fetch from 'node-fetch';

const handler: Handler = async (event: APIGatewayEvent) => {
  const { queryStringParameters: query } = event;
  if (!query || !query.code) {
    return { statusCode: 400 };
  }

  const {
    JONES_OAUTH_CLIENT_ID,
    JONES_OAUTH_CLIENT_SECRET,
    JONES_OAUTH_REDIR_URI,
  } = env.require(
    `JONES_OAUTH_CLIENT_ID`,
    `JONES_OAUTH_CLIENT_SECRET`,
    `JONES_OAUTH_REDIR_URI`,
  );

  const url = [
    `https://github.com/login/oauth/access_token`,
    `?client_id=${JONES_OAUTH_CLIENT_ID || ``}`,
    `&client_secret=${JONES_OAUTH_CLIENT_SECRET || ``}`,
    `&code=${query.code}`,
  ].join(``);

  const response = await fetch(url, {
    method: `POST`,
    headers: {
      Accept: `application/json`,
    },
  });

  const json = await response.json();
  if (!json.access_token) {
    return {
      statusCode: 403,
      body: JSON.stringify(json, null, 2),
    };
  }

  return {
    statusCode: 302,
    headers: {
      location: `${JONES_OAUTH_REDIR_URI}?access_token=${json.access_token}`,
    },
  };
};

export { handler };
