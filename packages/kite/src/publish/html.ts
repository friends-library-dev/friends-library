import { Html } from '@friends-library/types';

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
</html>`.trim();
}

export function removeMobi7Tags(file: string): string {
  return file
    .replace(/ *<br class="m7" *\/>\n?/gim, '')
    .replace(/ *<span class="m7">.+?<\/span>\n?/gim, '');
}

export const br7: string = '<br class="m7"/>';
