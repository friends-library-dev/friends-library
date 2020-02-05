import { Friend } from '@friends-library/friends';

export default function(friend: Friend): Record<string, any>[] {
  const residences = friend.residences;
  if (residences.length === 0) {
    // temp, faked data for now
    return [
      {
        city: 'London',
        country: 'England',
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
  country: string;
}): { top: number; left: number } {
  const place = `${residence.country}, ${residence.city}`;
  switch (place) {
    case 'England, York':
      return { top: 55, left: 22 };
    case 'Ireland, Clonmel':
      return { top: 22, left: 62 };
    default:
      return { top: 69, left: 66 };
    // @TODO restore error once all residences added
    // throw new Error(`Unknown residence: ${place}`);
  }
}
