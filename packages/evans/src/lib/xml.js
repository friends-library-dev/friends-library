// @flow
/* eslint-disable indent */
import { encode } from 'he';
import moment from 'moment';
import { Document, Edition } from 'classes';
import url from 'lib/url';
import { LANG, APP_URL, API_URL } from 'env';

export function podcast(document: Document, edition: Edition): string {
  const { friend } = document;
  const { audio } = edition;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  version="2.0"
>
  <channel>
    <atom:link
      href="${APP_URL}${url(audio)}"
      rel="self"
      type="application/rss+xml"
    />
    <title>${encode(document.title)}</title>
    <itunes:subtitle>
      Audiobook of ${document.isCompilation() ? '' : `${friend.name}'s`} "${document.title}" from The Friends Library. Read by ${audio.reader}.
    </itunes:subtitle>
    <link>${APP_URL}${url(audio)}</link>
    <language>${LANG}</language>
    <itunes:author>${encode(friend.name)}</itunes:author>
    <description>${encode(document.description)}</description>
    <itunes:summary>${encode(document.description)}</itunes:summary>
    <itunes:explicit>clean</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <itunes:complete>Yes</itunes:complete>
    <itunes:owner>
      <itunes:name>Jared Henderson</itunes:name>
      <itunes:email>jared.thomas.henderson@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${APP_URL}/img/podcast-artwork.gif" />
    <image>
      <url>${APP_URL}/img/podcast-artwork.gif</url>
      <title>${encode(document.title)}</title>
      <link>${APP_URL}${url(audio)}</link>
    </image>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity" />
    </itunes:category>
    ${audio.parts.map((part, index, parts) => {
      const num = index + 1;
      const desc = `${part.title}. Part ${num} of ${parts.length} of the audiobook version of "${encode(document.title)}" by ${encode(friend.name)}.`;
      return `<item>
      <title>Part ${num}</title>
      <enclosure
        url="${API_URL}/podcast-item/hq/${friend.slug}/${document.slug}/${edition.type}/${num}/${document.filename}--pt${num}.mp3"
        length="${part.filesizeHq}"
        type="audio/mpeg"
      />
      <itunes:author>${encode(friend.name)}</itunes:author>
      <itunes:summary>${desc}</itunes:summary>
      <itunes:subtitle>${desc}</itunes:subtitle>
      <description>${desc}</description>
      <guid isPermaLink="false">${url(audio)} pt-${num} at ${APP_URL}</guid>
      <pubDate>${moment().format('ddd, DD MMM YYYY hh:mm:ss ZZ')}</pubDate>
      <itunes:duration>${part.seconds}</itunes:duration>
      <itunes:order>${num}</itunes:order>
      <itunes:explicit>clean</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`;
    }).join('\n    ')}
  </channel>
</rss>
`;
}
