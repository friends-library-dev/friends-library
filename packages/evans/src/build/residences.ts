import { Friend } from '@friends-library/friends';

export default function(friend: Friend): Record<string, any>[] {
  const residences = friend.residences;
  if (residences.length === 0) {
    // temp, faked data for now
    return [
      {
        city: 'London',
        region: 'England',
        map: 'UK',
        top: 69,
        left: 66,
        durations: [{ start: 1660, end: 1718 }],
      },
    ];
  }
  return residences.map(r => ({
    ...r,
    map: 'UK', // @TODO infer from city/state
    ...position(r),
  }));
}

function position(residence: {
  city: string;
  region: string;
}): { top: number; left: number } {
  const place = `${residence.region}, ${residence.city}`;
  switch (place) {
    case 'England, York':
      return { top: 55, left: 22 };
    case 'Ireland, Clonmel':
      return { top: 22, left: 62 };
    default:
      return {
        top: Number((Math.random() * 100).toFixed(2)),
        left: Number((Math.random() * 100).toFixed(2)),
      };
    // @TODO restore error once all residences added
    // throw new Error(`Unknown residence: ${place}`);
  }
}
