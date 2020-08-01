import { Ref } from './find';

function incorrectJohannine({ book, position: { start } }: Ref, input: string): boolean {
  if (book !== `John`) {
    return false;
  }

  let bool = false;

  const prefs = [
    `1`,
    `2`,
    `3`,
    `i`,
    `ii`,
    `iii`,
    `I`,
    `II`,
    `III`,
    `First`,
    `Second`,
    `Third`,
    `1st`,
    `2nd`,
    `3rd`,
  ];

  prefs.forEach((pref) => {
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

function incorrect(
  wrongBook: string,
  wrongMatch: RegExp,
  prev: string,
): (ref: Ref, input: string) => boolean {
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

export function incorrectAmbiguous(ref: Ref, input: string): boolean {
  return [
    incorrectJohannine,
    incorrect(`Song of Solomon`, /^ss\./, ` the`),
    incorrect(`Song of Solomon`, /^so /, `al`),
    incorrect(`Esther`, /^es,? /, `jam`),
    incorrect(`Esther`, /^es /, `ecclesiast`),
    incorrect(`Esther`, /^es\. /, `eccl`),
    incorrect(`Esther`, /^es /, `chronicl`),
    incorrect(`Esther`, /^es\. /, `1 th`),
    incorrect(`Esther`, /^es\. /, `2 th`),
    incorrect(`Esther`, /^es\. /, `eph`),
    incorrect(`Esther`, /^es /, `judg`),
    incorrect(`Genesis`, /^ges /, `jud`),
    incorrect(`Amos`, /^am\. /, `j`),
    incorrect(`Romans`, /^rom /, `f`),
  ].reduce((result, fn) => result || fn(ref, input), false as boolean);
}
