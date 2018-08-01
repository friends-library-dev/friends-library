// @flow
import moment from 'moment';
import type { SourceSpec, Html } from '../type';

export function frontmatter(spec: SourceSpec): Html {
  const { document, friend, date, hash } = spec;
  const time = moment.utc(moment.unix(date)).format('MMMM Do, YYYY');
  return `
    <div class="half-title-page">
      <h1>${document.title}</h1>
      <p class="byline">by ${friend.name}</p>
    </div>
    ${originalTitle(spec)}
    <div class="copyright-page own-page">
      <ul>
        <li>Public domain in the USA</li>
        ${document.published ? `<li>Originally published in ${document.published}</li>` : ''}
        <li>Ebook revision <code><a href="${githubUrl(spec)}">${hash}</a></code> — ${time}</li>
        <li>Ebook created and freely distributed by <a href="https://friendslibrary.com">The Friends Library</a></li>
        <li>Find many other free books from early Quakers at <a href="https://friendslibrary.com">friendslibrary.com</a></li>
        <li>Contact the publishers at <a href="mailto:info@friendslibrary.com.com">info@friendslibrary.com</a></li>
      </ul>
      ${footnoteHelper(spec)}
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
    <div class="original-title-page own-page">
      <p class="originally-titled__label">
        Original title:
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
    <div class="footnote-helper own-page">
      <h3>Help with Footnotes</h3>
      <p>
        This e-book contains footnotes. When you see a reference number, click it to access the footnote. Once you're done reading the note, it's easy to get back to exactly where you were just reading—just click the the back arrow <span>(↩)</span> after the note, or the note number at the beginning of the note. Here's a sample footnote for you to practice.<sup class="footnote"><a id="_footnoteref_1" class="footnote" href="notes.xhtml#_footnotedef_1">1</a></sup>
      </p>
    </div>
  `;
}
