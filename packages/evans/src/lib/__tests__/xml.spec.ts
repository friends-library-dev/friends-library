import { getFriend, Audio, Document } from '@friends-library/friends';
import { partTitle, partDesc } from '../xml';

describe('partTitle()', () => {
  it('should use full title for standalone audio part', () => {
    const [audio] = getSinglePartAudio();
    expect(partTitle(audio.parts[0], 1, 1)).toBe('A Letter of Elizabeth Webb');
  });

  it('it should append short part identifier to title for multi-part audio', () => {
    const [audio] = getMultiPartAudio();
    expect(partTitle(audio.parts[0], 1, audio.parts.length)).toBe(
      'Saved to the Uttermost, pt. 1',
    );
  });
});

describe('partDesc()', () => {
  it('should return correct description for multi-part audio', () => {
    const [audio] = getMultiPartAudio();
    expect(partDesc(audio.parts[0], 1, audio.parts.length)).toBe(
      'Ch. 1 - The Condition of Man in the Fall. Part 1 of 6 of the audiobook version of "Saved to the Uttermost" by Robert Barclay',
    );
  });

  it('should not prepend `part x` if that is the audio part title', () => {
    const [audio] = getAudio('hugh-turford', 'walk-in-the-spirit');
    if (audio.parts[0].title !== 'Part 1') {
      throw new Error('Bad test data for prepending part');
    }
    expect(partDesc(audio.parts[0], 1, audio.parts.length)).toBe(
      'Part 1 of 3 of the audiobook version of "Walk in the Spirit" by Hugh Turford',
    );
  });

  it('should not prepend Part x of y if audiobook is only one audio long', () => {
    const [audio] = getSinglePartAudio();
    expect(partDesc(audio.parts[0], 1, 1)).toBe(
      'Audiobook version of "A Letter of Elizabeth Webb" by Elizabeth Webb',
    );
  });
});

function getSinglePartAudio(): [Audio, Document] {
  const [audio, doc] = getAudio('elizabeth-webb', 'letter');
  if (audio.parts.length !== 1) {
    throw new Error('Single part audio not single part');
  }
  return [audio, doc];
}

function getMultiPartAudio(): [Audio, Document] {
  const [audio, doc] = getAudio('robert-barclay', 'saved-to-the-uttermost');
  if (audio.parts.length < 2) {
    throw new Error('Multi part audio not multi part');
  }
  return [audio, doc];
}

function getAudio(friendSlug: string, docSlug: string): [Audio, Document] {
  const friend = getFriend(friendSlug, 'en');
  const doc = friend.documents.find(d => d.slug === docSlug);
  const edition = doc!.editions.find(e => e.audio);
  const audio = edition!.audio!;
  return [audio, doc!];
}
