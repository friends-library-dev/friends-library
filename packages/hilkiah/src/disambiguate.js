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

function incorrectSong({ book, match, position: { start } }, input) {
  if (book !== 'Song of Solomon') {
    return false;
  }

  if (!match.match(/^ss\./)) {
    return false;
  }

  if (input.substring(start - 4, start).toLowerCase() === ' the') {
    return true;
  }

  return false;
}

module.exports = { incorrectJohannine, incorrectSong };
