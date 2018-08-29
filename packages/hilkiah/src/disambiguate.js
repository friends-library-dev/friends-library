function incorrectJohannine({ book, position: { start } }, input) {
  if (book !== 'John') {
    return false;
  }

  let bool = false;

  const prefs = [
    '1',
    '2',
    '3',
    'i',
    'ii',
    'iii',
    'I',
    'II',
    'III',
    'First',
    'Second',
    'Third',
    '1st',
    '2nd',
    '3rd',
  ];

  prefs.forEach(pref => {
    if (bool) {
      return;
    }

    if (input.substr(start - pref.length - 1, pref.length + 1) === `${pref} `) {
      bool = true;
      return;
    }

    if (input.substr(start - pref.length, pref.length) === pref) {
      bool = true;
    }
  });

  return bool;
}

function incorrect(wrongBook, wrongMatch, prev) {
  return ({ book, match, position: { start } }, input) => {
    if (book !== wrongBook) {
      return false;
    }

    if (!match.match(wrongMatch)) {
      return false;
    }

    if (input.substring(start - prev.length, start).toLowerCase() === prev) {
      return true;
    }

    return false;
  };
}

function incorrectAmbiguous(ref, input) {
  return [
    incorrectJohannine,
    incorrect('Song of Solomon', /^ss\./, ' the'),
    incorrect('Esther', /^es /, 'jam'),
  ].reduce((result, fn) => result || fn(ref, input), false);
}

module.exports = { incorrectAmbiguous };
