import moment from 'moment';
import { Xml } from '@friends-library/types';
import { Job } from '@friends-library/types';
import { frontmatter } from './frontmatter';

export function packageDocument(job: Job): Xml {
  const {
    id: jobId,
    spec: {
      lang,
      revision: { timestamp },
      meta: {
        author: { name, nameSort },
        title,
      },
    },
    meta: { perform, createEbookCover: withCover },
  } = job;
  const modified = moment.utc(moment.unix(timestamp)).format('YYYY-MM-DDThh:mm:ss[Z]');
  const randomizer = ` (${moment().format('h:mm:ss')})`;

  return `
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:language id="pub-language">${lang}</dc:language>
  <dc:identifier id="pub-id">friends-library/${
    perform ? jobId : Date.now()
  }</dc:identifier>
  <dc:title id="pub-title">${title}${perform ? '' : randomizer}</dc:title>
  <dc:creator id="author">${name}</dc:creator>
  <dc:publisher>The Friends Library</dc:publisher>
  <dc:subject>Quakers</dc:subject>
  <dc:subject>Religious Society of Friends</dc:subject>
  <dc:rights>Public domain in the USA.</dc:rights>
  <meta property="file-as" refines="#author">${nameSort}</meta>
  <meta property="dcterms:modified">${modified}</meta>
  ${withCover ? '<meta name="cover" content="cover-img" />' : ''}
</metadata>
<manifest>
  ${[...manifestItems(job)]
    .map(([id, data]) => `<item id="${id}" ${attrs(data)}/>`)
    .join('\n  ')}
</manifest>
<spine>
  ${spineItems(job)
    .map(id => `<itemref idref="${id}"/>`)
    .join('\n  ')}
</spine>
${
  withCover
    ? '<guide><reference href="cover.xhtml" title="Cover" type="cover"/></guide>'
    : ''
}
</package>
`.trim();
}

function attrs(data: Record<string, any>): string {
  return Object.entries(data)
    .reduce(
      (acc, [key, val]) => {
        acc.push(`${key}="${String(val)}"`);
        return acc;
      },
      [] as string[],
    )
    .join(' ');
}

interface Item {
  href: string;
  'media-type': 'text/css' | 'application/xhtml+xml' | 'image/png' | 'image/jpeg';
  properties?: string;
}

export function manifestItems(job: Job): Map<string, Item> {
  const {
    meta: { createEbookCover: withCover },
    spec: { sections, notes },
  } = job;
  const items = new Map<string, Item>();

  items.set('css', {
    href: 'style.css',
    'media-type': 'text/css',
  });

  if (withCover) {
    items.set('cover-img', {
      href: 'cover.png',
      'media-type': 'image/png',
      properties: 'cover-image',
    });

    items.set('cover', {
      href: 'cover.xhtml',
      'media-type': 'application/xhtml+xml',
    });
  }

  items.set('nav', {
    href: 'nav.xhtml',
    'media-type': 'application/xhtml+xml',
    properties: 'nav',
  });

  sections.forEach(({ id }) => {
    items.set(id, {
      href: `${id}.xhtml`,
      'media-type': 'application/xhtml+xml',
    });
  });

  if (notes.size) {
    items.set('notes', {
      href: 'notes.xhtml',
      'media-type': 'application/xhtml+xml',
    });
  }

  Object.keys(frontmatter(job)).forEach(slug =>
    items.set(slug, {
      href: `${slug}.xhtml`,
      'media-type': 'application/xhtml+xml',
    }),
  );

  return items;
}

export function spineItems(job: Job): string[] {
  const {
    meta: { createEbookCover: withCover },
    spec: { sections, notes },
  } = job;
  console.log(withCover);

  let items = Object.keys(frontmatter(job));
  items = items.concat(sections.map(section => section.id));

  if (notes.size) {
    items.push('notes');
  }

  if (withCover) {
    items.unshift('cover');
  }

  return items;
}
