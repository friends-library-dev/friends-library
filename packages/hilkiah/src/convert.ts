const ROMAN_NUMERAL_MAP: { [key: string]: number } = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

export function romanToArabic(input: string): number {
  const roman = input.toUpperCase();
  const letters = roman.split(``);
  let arabic = 0;

  letters.forEach((letter, i) => {
    const letterValue = ROMAN_NUMERAL_MAP[letter] || 0;
    const prevValue = ROMAN_NUMERAL_MAP[letters[i - 1]] || null;
    if (prevValue !== null && prevValue < letterValue) {
      arabic -= 2 * prevValue;
    }
    arabic += letterValue;
  });

  return arabic;
}

export function toNumber(input: string | number): number {
  const parsed = parseInt(String(input), 10);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  return romanToArabic(String(input));
}
