/* 
    if the book has a `timeline_date` field, prefer that
    else, if the book has a 'published' date, use that
    else, if friend lived to be less than 30, use death date
    else, use 75% of author age, rounded to nearest 5
    */

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
