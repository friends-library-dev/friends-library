import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Context, APIGatewayEvent, Callback } from 'aws-lambda';
import { handler as test } from './src/test';
import { handler as site } from './src/site/site';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/site', async (req: Request, res: Response) => {
  site(reqToEvent(req), <Context>{}, respond(res));
});

app.use('/test', async (req: Request, res: Response) => {
  test(reqToEvent(req), <Context>{}, respond(res));
});

app.listen(2345, () => console.log('Listening on port 2345'));

function reqToEvent(req: Request): APIGatewayEvent {
  const { path, method, headers, body, query } = req;
  return {
    path: path,
    httpMethod: method,
    // @ts-ignore
    headers,
    body: method === 'POST' ? JSON.stringify(body) : body,
    ...(query ? { queryStringParameters: query } : {}),
  };
}

function respond(res: Response): Callback {
  return (err, data) => {
    Object.keys(data.headers || {}).forEach(key => res.setHeader(key, data.headers[key]));
    res.status(data.statusCode);
    res.send(data.body);
  };
}
