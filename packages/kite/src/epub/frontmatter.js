// @flow
import moment from 'moment';
import { pickBy } from 'lodash';
import type { SourceSpec, Html } from '../type';
import { M7BR } from './index';
import { contentToc } from './toc';
import { divide } from '../publish/divide';

export function frontmatter(spec: SourceSpec): { [string]: Html } {
  const { document, friend, date, hash } = spec;
  const time = moment.utc(moment.unix(date)).format('MMMM Do, YYYY');
  const files = {
    'half-title': halfTitle(spec),
    'original-title': originalTitle(spec),
    'copyright': copyright(spec),
    'footnote-helper': footnoteHelper(spec),
    'content-toc': spec.target === 'epub' ? '' : contentToc(spec, divide(spec))
  };
  return pickBy(files, html => html !== '');
}

function copyright(spec: SourceSpec): Html {
  const { document, hash, date } = spec;
  const time = moment.utc(moment.unix(date)).format('MMMM Do, YYYY');
  return `
  <div class="copyright-page">
    <ul>
      <li>Public domain in the USA</li>
      ${document.published ? `<li>Originally published in ${document.published}</li>` : ''}
      <li>Ebook revision <code><a href="${githubUrl(spec)}">${hash}</a></code> — ${time}</li>
      <li>Ebook created and freely distributed by <a href="https://friendslibrary.com">The Friends Library</a></li>
      <li>Find many other free books from early Quakers at <a href="https://friendslibrary.com">friendslibrary.com</a></li>
      <li>Contact the publishers at <a href="mailto:info@friendslibrary.com.com">info@friendslibrary.com</a></li>
    </ul>
  </div>
  `;
}

function halfTitle({ document, friend }: SourceSpec): Html {
  return `
    <div class="half-title-page">
      <h1>${document.title}</h1>
      <p class="byline">${M7BR}by ${friend.name}</p>
    </div>
  `;
}

function githubUrl(spec: SourceSpec): string {
  return [
    'https://github.com/friends-library-docs',
    spec.friend.slug,
    'tree',
    spec.hash,
    spec.document.slug,
    spec.edition.type,
  ].join('/');
}

function originalTitle({ document }: SourceSpec): Html {
  if (!document.originalTitle) {
    return '';
  }

  return `
    <div class="original-title-page">
      <p class="originally-titled__label">
        Original title:
        ${M7BR}${M7BR}
      </p>
      <p class="originally-titled__title">
        ${document.originalTitle}
      </p>
    </div>
  `;
}

function footnoteHelper({ html }: SourceSpec): Html {
  if (!html.includes('<div id="footnotes">')) {
    return '';
  }

  return `
    <div id="_footnoteref_1" class="footnote-helper">
      <h3>Help with Footnotes</h3>
      ${M7BR}
      <p>
        This e-book contains footnotes. When you see a reference number, click it to access the footnote. Once you're done reading the note, it's easy to get back to exactly where you were just reading—just click the the back arrow <span>(\u23CE)</span> after the note, or the note number at the beginning of the note. Here's a sample footnote for you to practice.<sup class="footnote"><a class="footnote" href="notes.xhtml#_footnotedef_1">1</a></sup>
      </p>
    </div>
  `;
}
