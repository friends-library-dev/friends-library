// @flow
import { Base64 } from 'js-base64';
import { lint, lintFix } from '@friends-library/asciidoc';
import type { $Request, $Response } from 'express';

export function check(req: $Request, res: $Response) {
  const body = ((req.body: any): {| encoded: string |});
  const { encoded } = body;
  const adoc = Base64.decode(encoded);
  res.json(lint(adoc));
}

export function fix(req: $Request, res: $Response) {
  const body = ((req.body: any): {| encoded: string |});
  const { encoded } = body;
  const adoc = Base64.decode(encoded);
  const { fixed } = lintFix(adoc);
  res.json({
    encoded: fixed === adoc ? null : Base64.encode(fixed),
  });
}
