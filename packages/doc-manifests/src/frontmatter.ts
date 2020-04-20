import moment from 'moment';
import { memoize, pickBy } from 'lodash';
import { Html, DocPrecursor, FileManifest } from '@friends-library/types';
import { capitalizeTitle, ucfirst, br7, epigraph } from '@friends-library/doc-html';
import { addVolumeSuffix } from './faux-volumes';

export const frontmatter = memoize(
  (dpc: DocPrecursor): FileManifest => {
    const files = {
      'half-title': halfTitle(dpc),
      'original-title': originalTitle(dpc),
      copyright: copyright(dpc),
      epigraph: epigraph(dpc),
    };
    return pickBy(files, html => html !== '');
  },
);

export function halfTitle(dpc: DocPrecursor, volIdx?: number): Html {
  const {
    lang,
    meta: {
      title,
      editor,
      author: { name },
    },
  } = dpc;

  let markup = `<h1>${addVolumeSuffix(title, volIdx)}</h1>`;
  const nameInTitle = title.indexOf(name) !== -1;
  if (!nameInTitle && !dpc.isCompilation) {
    markup = `${markup}\n<p class="byline">${br7}${
      lang === 'en' ? 'by' : 'por'
    } ${name}</p>`;
  }

  if (editor && lang === 'en') {
    markup += `\n<p class="editor">${br7}${br7}${br7}Edited by ${editor}</p>`;
  }

  return markup;
}

function originalTitle({ meta, lang }: DocPrecursor): Html {
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
        ${capitalizeTitle(meta.originalTitle, lang)}
      </p>
    </div>
  `;
}

export function copyright(dpc: DocPrecursor): Html {
  const {
    lang,
    revision: { timestamp, sha, url },
    meta: { published, isbn },
  } = dpc;
  moment.locale(lang);
  let time = moment
    .utc(moment.unix(timestamp))
    .format(lang === 'en' ? 'MMMM Do, YYYY' : 'D [de] MMMM, YYYY');

  if (lang === 'es') {
    time = time
      .split(' ')
      .map(p => (p === 'de' ? p : ucfirst(p)))
      .join(' ');
  }

  let t = {
    publicDomain: 'Public domain in the USA',
    publishedIn: 'Originally published in',
    publisher: 'Friends Library Publishing',
    domain: 'friendslibrary.com',
    email: 'info@friendslibrary.com',
    textRevision: 'Text revision',
    createdBy: 'Ebook created and freely distributed by',
    moreFreeBooks: 'Find more free books from early Quakers at',
    contact: 'Contact the publishers at',
  };

  if (lang === 'es') {
    t = {
      publicDomain: 'Dominio público en los Estados Unidos de América',
      publishedIn: 'Publicado originalmente en',
      publisher: 'La Biblioteca de los Amigos',
      domain: 'bibliotecadelosamigos.org',
      email: 'info@bibliotecadelosamigos.org',
      textRevision: 'Revisión de texto',
      createdBy: 'Creado y distribuido gratuitamente por',
      moreFreeBooks: 'Encuentre más libros gratis de los primeros Cuáqueros en',
      contact: 'Puede contactarnos en',
    };
  }

  return `
  <div class="copyright-page">
    <ul>
      <li>${t.publicDomain}</li>
      ${published ? `<li>${t.publishedIn} ${published}</li>` : ''}
      ${isbn ? `<li id="isbn">ISBN: <code>${isbn}</code></li>` : ''}
      <li>${t.textRevision} <code><a href="${url}">${sha}</a></code> — ${time}</li>
      <li>${t.createdBy} <a href="https://${t.domain}">${t.publisher}</a></li>
      <li>${t.moreFreeBooks} <a href="https://${t.domain}">${t.domain}</a></li>
      <li>${t.contact} <a href="mailto:${t.email}">${t.email}</a></li>
    </ul>
  </div>
  `;
}
