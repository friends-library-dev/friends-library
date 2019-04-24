import { lint, lintFix } from '@friends-library/asciidoc';
import { Base64 } from 'js-base64';
import { Request, Response } from 'express';

export function check(req: Request, res: Response): void {
  const encoded: string = (<any>req.body).encoded;
  const adoc = Base64.decode(encoded);
  res.json(lint(adoc));
}

export function fix(req: Request, res: Response): void {
  const encoded: string = (<any>req.body).encoded;
  const adoc = Base64.decode(encoded);
  const { fixed } = lintFix(adoc);
  res.json({
    encoded: fixed === adoc ? null : Base64.encode(fixed),
  });
}
