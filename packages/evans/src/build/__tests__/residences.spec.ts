import residences from '../residences';

describe(`residences()`, () => {
  it(`returns the correct basic info for simple, single residence`, () => {
    const res = [{ city: `London`, region: `England` }];
    const expected = [
      { top: 73.5, left: 59.5, map: `UK`, city: `London`, region: `England` },
    ];

    expect(residences(res)).toMatchObject(expected);
  });

  it(`returns the correct basic info for single-map, dual residence`, () => {
    const res = [
      { city: `Bristol`, region: `England` },
      { city: `London`, region: `England` },
    ];
    const expected = [
      { top: 74.1, left: 50.3, map: `UK`, city: `Bristol`, region: `England` },
      { top: 73.5, left: 59.5, map: `UK`, city: `London`, region: `England` },
    ];

    expect(residences(res)).toMatchObject(expected);
  });

  it(`handles dual-map by preferring majority, when possible`, () => {
    const res = [
      { city: `Bristol`, region: `England` },
      { city: `Rahway`, region: `New Jersey` },
      { city: `London`, region: `England` },
    ];
    const expected = [
      { top: 74.1, left: 50.3, map: `UK`, city: `Bristol`, region: `England` },
      // outlier below is set to same map, and made invisible by negative offsets
      { top: -1000, left: -1000, map: `UK`, city: `Rahway`, region: `New Jersey` },
      { top: 73.5, left: 59.5, map: `UK`, city: `London`, region: `England` },
    ];

    expect(residences(res)).toMatchObject(expected);
  });
});
