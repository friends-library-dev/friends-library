import { Lang } from '@friends-library/types';

export interface DateableDocument {
  timelineDate?: number;
  published?: number;
  friend: {
    born?: number;
    died?: number;
  };
}

export function documentDate({
  timelineDate,
  published,
  friend: { born, died },
}: DateableDocument): number {
  if (timelineDate) {
    return timelineDate;
  }

  if (published) {
    return published;
  }

  // the James Parnell case
  if (born && died && died - born < 31) {
    return died;
  }

  if (died && !born) {
    return died - 10;
  }

  if (born && died) {
    return Math.floor(born + 0.75 * (died - born));
  }

  // @TODO @BLOCKER throw an error here to ensure that we can
  // at least have a reasonable date guess for every book
  return 1700;
}

export function periodFromDate(date: number): 'early' | 'mid' | 'late' {
  if (date <= 1720) {
    return 'early';
  }
  if (date <= 1810) {
    return 'mid';
  }
  return 'late';
}

export function published(
  dateStr: string,
  lang: Lang,
): { publishedTimestamp: number; publishedDate: string } {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat(lang, { month: 'short' });
  const month = formatter.format(date);
  return {
    publishedTimestamp: date.getTime(),
    publishedDate: `${month} ${date.getDate()}`,
  };
}
