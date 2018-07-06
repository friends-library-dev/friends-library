const books = require('./books.json');

function format({ book, verses, contiguous, match }, opts = {}) {
  const options = {
    shortBookNames: true,
    preserveFull: true,
    ...opts,
  };

  let str = book;
  const { short, name } = books.find(b => b.name == book);

  if (options.shortBookNames && short !== book) {
    str = `${short}.`;
  }

  if (options.preserveFull && match.indexOf(book) === 0) {
    str = book;
  }

  str += ` ${verses[0].chapter}:${verses[0].verse}`;
  if (verses.length === 1) {
    return str;
  }

  if (contiguous) {
    return str += `-${verses.pop().verse}`;
  }

  return str += `,${verses.slice(1).map(v => v.verse).join(',')}`;
}

module.exports = { format };
