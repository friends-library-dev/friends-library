const books = require('./books.json');
const { toNumber } = require('./convert');
const { romanSingleOrRange, colonComma, colonSingleOrRange, romanComma } = require('./verses');
const { incorrectJohannine, incorrectSong } = require ('./disambiguate');

const ROM = '(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})'
const ARAB = '[\\d]{1,3}';


function absorbRight(ref, input) {
  const { position: { start, end } } = ref;
  const afterRef = input.substr(end);
  const match = afterRef.match(/^(?:[\.|:|;|,])? *\)/);
  if (match) {
    const absorbed = match[0].substr(0, match[0].length - 1);
    ref.match += absorbed;
    ref.position.end += absorbed.length;
  }
  return ref;
}

function extractRef(book, chapter, match) {
  const start = match.index + match[0].length;
  const context = match.input.substring(start, start + 25);

  // order matters!
  const strategies = [
    romanComma,
    colonComma,
    romanSingleOrRange,
    colonSingleOrRange,
  ];

  let ref = {
    book,
    contiguous: true,
    verses: [],
    position: {
      start: match.index,
    }
  };

  strategies.forEach(strategy => {
    if (ref.position.end) {
      return;
    }

    ref = strategy(start, context, ref, chapter);
  });

  if (!ref.position.end) {
    return null;
  }

  const { position } = ref;
  ref.match = match.input.substr(position.start, position.end - position.start);

  ref = absorbRight(ref, match.input);

  if (incorrectJohannine(ref, match.input) || incorrectSong(ref, match.input)) {
    return null;
  }

  return ref;
}


function find(str) {
  const refs = [];

  books.forEach(book => {
    let pattern = book.abbreviations
      .concat([book.name])
      .map(abbrev => abbrev.replace('.', '\\.'))
      .join('|');

    pattern = `(?:${pattern})(?:\.)? (${ARAB}|${ROM})`;
    const exp = new RegExp(pattern, 'gi');
    let match;
    while (match = exp.exec(str)) {
      refs.push(extractRef(book.name, toNumber(match[1]), match));
    }
  });

  return refs.filter(ref => !!ref);
}

module.exports = { find };
