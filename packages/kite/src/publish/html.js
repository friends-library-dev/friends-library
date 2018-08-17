// @flow
import type { Html } from '../type';

export function wrapHtml(html: Html): Html {
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
  <head>
    <meta charset="UTF-8"/>
    <link href="style.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>
    ${html.trim()}
  </body>
</html>`
    .trim();
}

export function removeMobiBrs(file: string): string {
  return file.replace(/ *<br class="m7" *\/>\n?/igm, '');
}
