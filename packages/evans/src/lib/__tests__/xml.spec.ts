import { getFriend, Audio, Document } from '@friends-library/friends';
import { Lang } from '@friends-library/types';
import { partTitle, partDesc, subtitle } from '../xml';

describe(`subtitle()`, () => {
  const cases: [Lang, string, string, string][] = [
    [
      `en`,
      `elizabeth-webb`,
      `letter`,
      `Audiobook of Elizabeth Webb's "A Letter of Elizabeth Webb" from The Friends Library. Read by Jason R. Henderson.`,
    ],
    [
      `en`,
      `compilations`,
      `truth-in-the-inward-parts-v1`,
      `Audiobook of "Truth in the Inward Parts -- Volume 1" from The Friends Library. Read by Jason R. Henderson.`,
    ],
    [
      `es`,
      `elizabeth-webb`,
      `carta`,
      `Audiolibro de "La Carta de Elizabeth Webb" escrito por Elizabeth Webb, de la Biblioteca de los Amigos. Leído por Keren Alvaredo.`,
    ],
    [
      `es`,
      `compilaciones`,
      `verdad-en-lo-intimo`,
      `Audiolibro de "La Verdad en Lo Íntimo", de la Biblioteca de los Amigos. Leído por Keren Alvaredo.`,
    ],
  ];

  test.each(cases)(`subtitle for %s/%s/%s`, (lang, friend, doc, expected) => {
    const [audio] = getAudio(friend, doc, lang);
    expect(subtitle(audio)).toBe(expected);
  });
});

describe(`partTitle()`, () => {
  it(`should use full title for standalone audio part`, () => {
    const [audio] = getSinglePartAudio();
    expect(partTitle(audio.parts[0], 1, 1)).toBe(`A Letter of Elizabeth Webb`);
  });

  it(`it should append short part identifier to title for multi-part audio`, () => {
    const [audio] = getMultiPartAudio();
    expect(partTitle(audio.parts[0], 1, audio.parts.length)).toBe(
      `Saved to the Uttermost, pt. 1`,
    );
  });
});

describe(`partDesc()`, () => {
  const cases: [Lang, string, string, string][] = [
    [
      `en`,
      `robert-barclay`,
      `saved-to-the-uttermost`,
      `Ch. 1 - The Condition of Man in the Fall. Part 1 of 6 of the audiobook version of "Saved to the Uttermost" by Robert Barclay`,
    ],
    [
      `en`,
      `elizabeth-webb`,
      `letter`,
      `Audiobook version of "A Letter of Elizabeth Webb" by Elizabeth Webb`,
    ],
    [
      `es`,
      `isaac-penington`,
      `escritos-volumen-1`,
      `Cp. 1. Parte 1 de 19 del audiolibro de "Los Escritos de Isaac Penington -- Volumen 1" escrito por Isaac Penington`,
    ],
    [
      `es`,
      `elizabeth-webb`,
      `carta`,
      `Audiolibro de "La Carta de Elizabeth Webb" escrito por Elizabeth Webb`,
    ],
  ];

  test.each(cases)(`partDesc() for %s/%s/%s`, (lang, friend, doc, expected) => {
    const [audio] = getAudio(friend, doc, lang);
    expect(partDesc(audio.parts[0], 1, audio.parts.length)).toBe(expected);
  });

  it(`should return correct description for multi-part audio`, () => {
    const [audio] = getMultiPartAudio();
    expect(partDesc(audio.parts[0], 1, audio.parts.length)).toBe(
      `Ch. 1 - The Condition of Man in the Fall. Part 1 of 6 of the audiobook version of "Saved to the Uttermost" by Robert Barclay`,
    );
  });

  it(`should not prepend \`part x\` if that is the audio part title`, () => {
    const [audio] = getAudio(`hugh-turford`, `walk-in-the-spirit`);
    if (audio.parts[0].title !== `Part 1`) {
      throw new Error(`Bad test data for prepending part`);
    }
    expect(partDesc(audio.parts[0], 1, audio.parts.length)).toBe(
      `Part 1 of 3 of the audiobook version of "Walk in the Spirit" by Hugh Turford`,
    );
  });

  it(`should not prepend Part x of y if audiobook is only one audio long`, () => {
    const [audio] = getSinglePartAudio();
    expect(partDesc(audio.parts[0], 1, 1)).toBe(
      `Audiobook version of "A Letter of Elizabeth Webb" by Elizabeth Webb`,
    );
  });
});

function getSinglePartAudio(): [Audio, Document] {
  const [audio, doc] = getAudio(`elizabeth-webb`, `letter`);
  if (audio.parts.length !== 1) {
    throw new Error(`Single part audio not single part`);
  }
  return [audio, doc];
}

function getMultiPartAudio(): [Audio, Document] {
  const [audio, doc] = getAudio(`robert-barclay`, `saved-to-the-uttermost`);
  if (audio.parts.length < 2) {
    throw new Error(`Multi part audio not multi part`);
  }
  return [audio, doc];
}

function getAudio(
  friendSlug: string,
  docSlug: string,
  lang: Lang = `en`,
): [Audio, Document] {
  const friend = getFriend(friendSlug, lang);
  const doc = friend.documents.find(d => d.slug === docSlug);
  const edition = doc!.editions.find(e => e.audio);
  const audio = edition!.audio!;
  return [audio, doc!];
}
