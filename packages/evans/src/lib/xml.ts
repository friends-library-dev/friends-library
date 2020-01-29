import { encode } from 'he';
import moment from 'moment';
import { Document, Edition, AudioPart } from '@friends-library/friends';
import { AudioQuality } from '@friends-library/types';
import env from '@friends-library/env';
import { LANG, APP_URL } from '../env';
import { podcastUrl, mp3PartDownloadUrl } from './url';

export function podcast(
  document: Document,
  edition: Edition,
  quality: AudioQuality,
): string {
  const { friend } = document;
  const { audio } = edition;
  if (!audio) {
    throw new Error('Document has no audio');
  }

  const { CLOUD_STORAGE_BUCKET_URL: CLOUD_URL } = env.require('CLOUD_STORAGE_BUCKET_URL');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  version="2.0"
>
  <channel>
    <atom:link
      href="${APP_URL}${podcastUrl(audio, quality)}"
      rel="self"
      type="application/rss+xml"
    />
    <title>${encode(document.title)}</title>
    <itunes:subtitle>
      Audiobook of ${document.isCompilation ? '' : `${friend.name}'s`} "${
    document.title
  }" from The Friends Library. Read by ${audio.reader}.
    </itunes:subtitle>
    <link>${APP_URL}${podcastUrl(audio, quality)}</link>
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
    <itunes:image href="${CLOUD_URL}/${audio.imagePath}" />
    <image>
      <url>${CLOUD_URL}/${audio.imagePath}</url>
      <title>${encode(document.title)}</title>
      <link>${APP_URL}${podcastUrl(audio, quality)}</link>
    </image>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity" />
    </itunes:category>
    ${audio.parts
      .map((part, index) => {
        const num = index + 1;
        const desc = partDesc(part, num, audio.parts.length);
        return `<item>
      <title>${partTitle(part, num, audio.parts.length)}</title>
      <enclosure
        url="${APP_URL}${mp3PartDownloadUrl(audio, quality, index)}"
        length="${part.filesizeHq}"
        type="audio/mpeg"
      />
      <itunes:author>${encode(friend.name)}</itunes:author>
      <itunes:summary>${desc}</itunes:summary>
      <itunes:subtitle>${desc}</itunes:subtitle>
      <description>${desc}</description>
      <guid isPermaLink="false">${podcastUrl(
        audio,
        quality,
      )} pt-${num} at ${APP_URL}</guid>
      <pubDate>${moment().format('ddd, DD MMM YYYY hh:mm:ss ZZ')}</pubDate>
      <itunes:duration>${part.seconds}</itunes:duration>
      <itunes:order>${num}</itunes:order>
      <itunes:explicit>clean</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`;
      })
      .join('\n    ')}
  </channel>
</rss>
`;
}

export function partDesc(part: AudioPart, partNumber: number, numParts: number): string {
  const document = part.audio.edition.document;
  const byLine = `"${encode(document.title)}" by ${encode(document.friend.name)}`;
  if (numParts === 1) {
    return `Audiobook version of ${byLine}`;
  }

  let desc = [
    `Part ${partNumber} of ${part.audio.parts.length}`,
    `of the audiobook version of`,
    byLine,
  ].join(' ');

  if (part.title !== `Part ${partNumber}`) {
    desc = `${part.title}. ${desc}`;
  }

  desc = desc.replace(/^Chapter (\d)/, 'Ch. $1');
  desc = desc.replace(/^Capítulo (\d)/, 'Cp. $1');

  return desc;
}

export function partTitle(part: AudioPart, partNumber: number, numParts: number): string {
  const title = part.audio.edition.document.title;
  if (numParts === 1) {
    return title;
  }
  return `${title}, pt. ${partNumber}`;
}
