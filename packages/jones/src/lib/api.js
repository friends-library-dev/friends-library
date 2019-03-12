// @flow
import { Base64 } from 'js-base64';
import type { Asciidoc } from '../../../../type';

if (typeof process.env.REACT_APP_API_URL !== 'string') {
  throw new Error('.env var `REACT_APP_API_URL` must be defined');
}

export function postJson(path: string, data: mixed): Promise<Response> {
  return fetch(`${process.env.REACT_APP_API_URL || ''}${path}`, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function postEncodedAsciidoc(path: string, adoc: Asciidoc): Promise<Response> {
  return postJson(path, {
    encoded: Base64.encode(adoc),
  });
}
