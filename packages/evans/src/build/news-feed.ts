import { DocumentMeta } from '@friends-library/document-meta';
import { Friend, Edition, Document } from '@friends-library/friends';
import { Lang, NewsFeedType } from '@friends-library/types';
import { htmlShortTitle } from '@friends-library/adoc-convert';
import { spanishShortMonth } from '../lib/date';
import { documentUrl } from '../lib/url';
import { APP_ALT_URL } from '../env';

interface FeedItem {
  month: string;
  day: string;
  year: string;
  type: NewsFeedType;
  title: string;
  description: string;
  url: string;
  date: string;
}

export function getNewsFeedItems(
  friends: Friend[],
  meta: DocumentMeta,
  lang: Lang,
  outOfBandEvents?: (FeedItem & { lang: Lang[] })[],
): FeedItem[] {
  const items: FeedItem[] = [];
  const [editions, docs] = entityMaps(friends);
  const formatter = new Intl.DateTimeFormat(`en-US`, { month: `short` });

  for (const [path, edition] of [...editions]) {
    const document = edition.document;
    const friend = document.friend;
    const title = htmlShortTitle(document.title);
    const edMeta = meta.get(path);
    if (friend.lang === lang) {
      if (edMeta && edition === document.primaryEdition && document.isComplete) {
        items.push({
          type: `book`,
          url: documentUrl(document),
          title,
          description:
            lang === `en`
              ? `Download free ebook or pdf, or purchase a paperback at cost.`
              : `Descárgalo en formato ebook o pdf, o compra el libro impreso a precio de costo.`,
          ...dateFields(edMeta.published, formatter, lang),
        });
      }
      if (edition.audio) {
        items.push({
          title: `${title} &mdash; (Audiobook)`,
          type: `audiobook`,
          url: `${documentUrl(document)}#audiobook`,
          description:
            lang === `en`
              ? `Free audiobook is now available for download or listening online.`
              : `El audiolibro ya está disponible para descargar gratuitamente o escuchar en línea.`,
          ...dateFields(edition.audio.added.toISOString(), formatter, lang),
        });
      }
    } else if (lang === `en` && edMeta && document.isComplete) {
      const englishDoc = docs.get(document.altLanguageId || ``);
      if (!englishDoc) throw new Error(`Missing alt language doc`);
      items.push({
        title: `${title} &mdash; (Spanish)`,
        type: `spanish_translation`,
        url: `${APP_ALT_URL}${documentUrl(document)}`,
        description: document.isCompilation
          ? `<em>${englishDoc.title}</em> now translated and available on the Spanish site.`
          : `${friend.name}&rsquo;s <em>${englishDoc.title}</em> now translated and available on the Spanish site.`,
        ...dateFields(edMeta.published, formatter, lang),
      });
    }

    if (!outOfBandEvents) {
      outOfBandEvents = getOutOfBandEvents(formatter).filter((e) =>
        e.lang.includes(lang),
      );
      items.push(...outOfBandEvents);
    }
  }

  return items
    .filter(({ date }) => {
      // earlier than this date is so close to site launch
      // that the chronology is mixed up and not really helpful
      return date.substring(0, 10) > `2020-04-28`;
    })
    .sort((a, b) => {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1;
    })
    .slice(0, MAX_NUM_NEWS_FEED_ITEMS);
}

function dateFields(
  dateStr: string,
  formatter: Intl.DateTimeFormat,
  lang: Lang,
): Pick<FeedItem, 'month' | 'year' | 'day' | 'date'> {
  const date = new Date(dateStr);
  let month = formatter.format(date);
  if (lang === `es`) {
    month = spanishShortMonth(month);
  }

  return {
    month,
    year: String(date.getFullYear()),
    day: String(date.getDate()),
    date: dateStr,
  };
}

function entityMaps(friends: Friend[]): [Map<string, Edition>, Map<string, Document>] {
  const editionMap = new Map<string, Edition>();
  const docMap = new Map<string, Document>();
  friends.forEach((friend) =>
    friend.documents.forEach((document) => {
      docMap.set(document.id, document);
      return document.editions.forEach((edition) => {
        if (!edition.isDraft) {
          editionMap.set(edition.path, edition);
        }
      });
    }),
  );
  return [editionMap, docMap];
}

function getOutOfBandEvents(
  formatter: Intl.DateTimeFormat,
): (FeedItem & { lang: Lang[] })[] {
  return [
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 2)`,
      description: `El segundo capítulo de la Historia de los Cuáqueros ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-07-14T12:00:01.000Z`, formatter, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 1)`,
      description: `El primer capítulo de la Historia de los Cuáqueros ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-06-12T12:00:00.000Z`, formatter, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Prefacio)`,
      description: `El prefacio de la Historia de los Cuáqueros ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-06-12T12:00:00.000Z`, formatter, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
  ];
}

const MAX_NUM_NEWS_FEED_ITEMS = 24;
