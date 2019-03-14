const books: Array<{
  name: string;
  abbreviations: string[];
}> = require('./books.json');
const { toNumber } = require('./convert');
const {
  romanSingleOrRange,
  colonComma,
  colonSingleOrRange,
  romanComma,
} = require('./verses');
const { incorrectAmbiguous } = require('./disambiguate');

export type Ref = {
  book: string;
  contiguous: boolean;
  verses: Array<{
    chapter: number;
    verse: number;
  }>;
  match: string;
  position: {
    start: number;
    end: number;
  };
};

const ROM = '(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})';
const ARAB = '[\\d]{1,3}';

function absorbRight(ref: Ref, input: string): Ref {
  const {
    position: { end },
  } = ref;
  const afterRef = input.substr(end);
  const match = afterRef.match(/^(?:[.|:|;|,])? *\)/);
  if (!match) {
    return ref;
  }

  const absorbed = match[0].substr(0, match[0].length - 1);
  return {
    ...ref,
    match: ref.match.concat(absorbed),
    position: {
      ...ref.position,
      end: ref.position.end + absorbed.length,
    },
  };
}

function extractRef(book: string, chapter: number, match: RegExpMatchArray): Ref | null {
  if (match.index === undefined || match.input == undefined) {
    return null;
  }
  const start = match.index + match[0].length;
  const context = match.input.substring(start, start + 25);

  // order matters!
  const strategies = [romanComma, colonComma, romanSingleOrRange, colonSingleOrRange];

  let ref: Ref = {
    book,
    contiguous: true,
    match: '',
    verses: [],
    position: {
      start: match.index,
      end: -1,
    },
  };

  strategies.forEach(strategy => {
    if (ref.position.end !== -1) {
      return;
    }

    ref = strategy(start, context, ref, chapter);
  });

  if (ref.position.end === -1) {
    return null;
  }

  const { position } = ref;
  ref.match = match.input.substr(position.start, position.end - position.start);

  ref = absorbRight(ref, match.input);

  if (incorrectAmbiguous(ref, match.input)) {
    return null;
  }

  return ref;
}

export function find(str: string) {
  const refs: Ref[] = [];
  books.forEach(book => {
    let pattern = book.abbreviations
      .concat([book.name])
      .map(abbrev => abbrev.replace('.', '\\.'))
      .join('|');

    pattern = `(?:${pattern})(?:.)? (${ARAB}|${ROM})`;
    const exp = new RegExp(pattern, 'gi');
    let match;
    while ((match = exp.exec(str))) {
      const chapter = toNumber(match[1]) as number;
      const ref = extractRef(book.name, chapter, match);
      if (ref) refs.push(ref);
    }
  });
  return refs;
}
