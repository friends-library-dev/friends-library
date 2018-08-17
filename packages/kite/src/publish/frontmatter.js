// @flow
import moment from 'moment';
import { memoize, pickBy } from 'lodash';
import type { Job, Html } from '../type';

export const frontmatter = memoize((job: Job): { [string]: Html } => {
  const files = {
    'half-title': halfTitle(job),
    'original-title': originalTitle(job),
    copyright: copyright(job),
  };
  return pickBy(files, html => html !== '');
});

function halfTitle(job: Job): Html {
  const { spec: { meta: { title, author: { name } } } } = job;
  return `
    <div class="half-title-page">
      <h1>${title}</h1>
      <p class="byline"><br class="m7"/>by ${name}</p>
    </div>
  `;
}

function originalTitle({ spec: { meta } }: Job): Html {
  if (!meta.originalTitle) {
    return '';
  }

  return `
    <div class="original-title-page">
      <p class="originally-titled__label">
        Original title:
        <br class="m7"/>
        <br class="m7"/>
      </p>
      <p class="originally-titled__title">
        ${meta.originalTitle}
      </p>
    </div>
  `;
}

export function copyright(job: Job): Html {
  const { spec: { revision: { timestamp, sha, url }, meta: { published } } } = job;
  const time = moment.utc(moment.unix(timestamp)).format('MMMM Do, YYYY');
  return `
  <div class="copyright-page">
    <ul>
      <li>Public domain in the USA</li>
      ${published ? `<li>Originally published in ${published}</li>` : ''}
      <li>Ebook revision <code><a href="${url}">${sha}</a></code> — ${time}</li>
      <li>Ebook created and freely distributed by <a href="https://friendslibrary.com">The Friends Library</a></li>
      <li>Find many other free books from early Quakers at <a href="https://friendslibrary.com">friendslibrary.com</a></li>
      <li>Contact the publishers at <a href="mailto:info@friendslibrary.com.com">info@friendslibrary.com</a></li>
    </ul>
  </div>
  `;
}
