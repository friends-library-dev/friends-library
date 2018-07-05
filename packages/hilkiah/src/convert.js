const ROMAN_NUMERAL_MAP = {
  'I': 1,
  'V': 5,
  'X': 10,
  'L': 50,
  'C': 100,
  'D': 500,
  'M': 1000,
};

function romanToArabic(roman) {
  roman = roman.toUpperCase();
  let letters = roman.split('');
  let arabic = 0;

  letters.forEach((letter, i) => {
    let letterValue = ROMAN_NUMERAL_MAP[letter];
    let prevValue = ROMAN_NUMERAL_MAP[letters[i - 1]] || null;
    if (prevValue !== null && prevValue < letterValue) {
      arabic = arabic - (2 * prevValue);
    }
    arabic = arabic + letterValue;
  });

  return arabic;
}

function toNumber(input) {
  const parsed = parseInt(input, 10);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  return romanToArabic(input);
}

module.exports = { romanToArabic, toNumber };
