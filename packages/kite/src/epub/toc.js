// @flow
import { toRoman } from 'roman-numerals';
import type { SourceSpec, DocSection, Html } from '../type';

export function toc(spec: SourceSpec, sections: Array<DocSection>): Html {
  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${spec.document.title}</title>
</head>
<body>
  <h1>${spec.document.title}</h1>
  <nav epub:type="toc" id="toc">
    <h2>Table of Contents</h2>
    <ol>
      <li><a href="frontmatter.xhtml">Title</a></li>
      ${sections.filter(s => s.id !== 'notes').map(sect =>
        `<li><a href="${sect.id}.xhtml">${entryText(sect, spec.config)}</a></li>`
      ).join('\n      ')}
    </ol>
  </nav>
</body>
</html>
  `.trim();
}


function entryText(section: DocSection, config: Object): string {
  if (!section.chapterNumber) {
    return section.chapterTitleShort || section.title || '';
  }

  let displayNumber = section.chapterNumber;
  if (config.chapterNumberFormat === 'roman') {
    displayNumber = toRoman(section.chapterNumber).toUpperCase();
  }

  let text = `Chapter ${displayNumber}`;
  if (section.chapterTitleShort) {
    text+= ` — ${section.chapterTitleShort}`;
  } else if (section.chapterTitleBody) {
    text+= ` — ${section.chapterTitleBody}`;
  }

  return text;
}
