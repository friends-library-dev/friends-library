// @flow
import moment from 'moment';
import { memoize, pickBy } from 'lodash';
import type { Html } from '../../../../type';
import type { Job, FileManifest, Epigraph } from '../type';
import { printDims } from './pdf/manifest';
import { capitalizeTitle, ucfirst } from './text';
import { br7 } from './html';

export const frontmatter = memoize((job: Job): FileManifest => {
  const files = {
    'half-title': halfTitle(job),
    'original-title': originalTitle(job),
    copyright: copyright(job),
    epigraph: epigraph(job),
  };
  return pickBy(files, html => html !== '');
});

export function epigraph({ spec: { epigraphs } }: Job): Html {
  if (!epigraphs.length) {
    return '';
  }
  return `
    <div class="epigraphs own-page">
      ${epigraphs.map(renderEpigraph).join(`\n${br7}\n${br7}\n`)}
    </div>
  `;
}

function renderEpigraph({ text, source }: Epigraph, index: number): Html {
  return `
    <div class="epigraph${index > 0 ? ' epigraph--not-first' : ''}">
      <span class="epigraph__text">
        &#8220;${text}&#8221;
      </span>
      ${source ? `<span class="epigraph__source">${source}</span>` : ''}
    </div>
  `;
}

export function halfTitle(job: Job): Html {
  const { spec: { lang, meta: { title, editor, author: { name } } } } = job;
  let markup = `<h1>${title}</h1>`;
  const nameInTitle = title.indexOf(name) !== -1;
  if (!nameInTitle) {
    markup = `${markup}\n<p class="byline">${br7}${lang === 'en' ? 'by' : 'por'} ${name}</p>`;
  }

  if (editor && lang === 'en') {
    markup += `\n<p class="editor">${br7}${br7}${br7}Edited by ${editor}</p>`;
  }

  return markup;
}

function originalTitle({ spec: { meta } }: Job): Html {
  if (!meta.originalTitle) {
    return '';
  }

  return `
    <div class="original-title-page">
      <p class="originally-titled__label">
        Original title:
        ${br7}
        ${br7}
      </p>
      <p class="originally-titled__title">
        ${capitalizeTitle(meta.originalTitle)}
      </p>
    </div>
  `;
}

export function copyright(job: Job): Html {
  const { spec: { lang, revision: { timestamp, sha, url }, meta: { published, isbn } } } = job;
  let marginData = '';
  if (job.meta.debugPrintMargins) {
    const dims = printDims(job);
    marginData = Object.keys(dims).map(k => {
      if (!k.match(/-margin/)) {
        return '';
      }
      return `<li class="debug"><code>$${k}: ${dims[k]};</code></li>`;
    }).join('\n').concat('<li></li><li></li>');
  }

  moment.locale(lang);
  let time = moment
    .utc(moment.unix(timestamp))
    .format(lang === 'en' ? 'MMMM Do, YYYY' : 'D [de] MMMM, YYYY');

  if (lang === 'es') {
    time = time.split(' ').map(p => p === 'de' ? p : ucfirst(p)).join(' ');
  }

  let strings = {
    publicDomain: 'Public domain in the USA',
    publishedIn: 'Originally published in',
    textRevision: 'Text revision',
    createdBy: 'Ebook created and freely distributed by',
    moreFreeBooks: 'Find more free books from early Quakers at',
    contact: 'Contact the publishers at',
  };

  if (lang === 'es') {
    strings = {
      publicDomain: 'Dominio público en los Estados Unidos de América',
      publishedIn: 'Publicado originalmente en',
      textRevision: 'Revisión de texto',
      createdBy: 'Creado y distribuido gratuitamente por',
      moreFreeBooks: 'Encuentre más libros gratis de los primeros Cuáqueros en',
      contact: 'Puede contactarnos en',
    };
  }

  return `
  <div class="copyright-page">
    <ul>
      ${marginData}
      <li>${strings.publicDomain}</li>
      ${published ? `<li>${strings.publishedIn} ${published}</li>` : ''}
      ${isbn ? `<li id="isbn">ISBN: <code>${isbn}</code></li>` : ''}
      <li>${strings.textRevision} <code><a href="${url}">${sha}</a></code> — ${time}</li>
      <li>${strings.createdBy} <a href="https://friendslibrary.com">Friends Library Publishing</a></li>
      <li>${strings.moreFreeBooks} <a href="https://friendslibrary.com">friendslibrary.com</a></li>
      <li>${strings.contact} <a href="mailto:info@friendslibrary.com.com">info@friendslibrary.com</a></li>
    </ul>
  </div>
  `;
}
