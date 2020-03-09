import Audio from '../Audio';
import AudioPart from '../AudioPart';

describe('Audio', () => {
  describe('.duration', () => {
    let audio: Audio;

    beforeEach(() => {
      // @ts-ignore
      audio = new Audio({});
    });

    it('returns human formatted string of duration', () => {
      audio.parts = partsFromSeconds(60, 60, 60, 5);
      expect(audio.duration).toBe('3:05');
    });

    const cases: [number[], string][] = [
      [[60 * 60 * 3], '3:00:00'],
      [[60 * 60 * 3, 60 * 5, 5], '3:05:05'],
      [[60 * 60 * 5, 60 * 19, 43], '5:19:43'],
      [[3318], '55:18'],
      [[3203], '53:23'],
      [[1815, 1807, 1834, 1691, 2573], '2:42:00'],
      [[3], '3'],
    ];

    test.each(cases)('%s should convert to %s', (secondses, expected) => {
      audio.parts = partsFromSeconds(...secondses);
      expect(audio.duration).toBe(expected);
    });
  });
});

function partsFromSeconds(...secondses: number[]): AudioPart[] {
  return secondses.map(seconds => ({ seconds })) as AudioPart[];
}
