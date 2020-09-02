import { Friend } from '@friends-library/friends';

type Map = 'UK' | 'US' | 'Europe';

interface Position {
  top: number;
  left: number;
  map: Map;
}

export default function (residences: Friend['residences']): Record<string, any>[] {
  const positions = residences.map(position);
  const map = deriveMap(positions);

  return residences.map((res) => {
    const pos = position(res);
    if (pos.map !== map) {
      pos.top = -1000;
      pos.left = -1000;
    }
    return {
      ...res,
      ...pos,
      map,
    };
  });
}

function deriveMap(positions: Position[]): 'UK' | 'US' | 'Europe' {
  if (positions.length === 0) return `UK`;
  const dict = positions.reduce((acc, pos) => {
    acc[pos.map] = (acc[pos.map] || []).concat([pos.map]);
    return acc;
  }, {} as Record<'UK' | 'US' | 'Europe', Map[]>);
  const arrays = Object.values(dict);
  arrays.sort((a, b) => (a.length < b.length ? 1 : -1));
  return arrays[0][0];
}

function position(residence: { city: string; region: string }): Position {
  const place = [residence.city, residence.region].join(`, `);
  switch (place) {
    case `St. Petersburg, Russia`:
      return { top: 19.0, left: 87.4, map: `Europe` };
    case `Sheffield, England`:
      return { top: 58.0, left: 27.4, map: `Europe` };
    case `Needham Market, England`:
      return { top: 67.6, left: 64.3, map: `UK` };
    case `Bucks County, Pennsylvania`:
      return { top: 48.0, left: 49.5, map: `US` };
    case `Newton, New Jersey`:
      return { top: 44.4, left: 51.4, map: `US` };
    case `Woodstown, New Jersey`:
      return { top: 54.0, left: 49.4, map: `US` };
    case `Barnesville, Ohio`:
      return { top: 51.4, left: 30.3, map: `US` };
    case `Mount Holly, New Jersey`:
      return { top: 52.0, left: 51.2, map: `US` };
    case `Nottingham, Pennsylvania`:
      return { top: 53.0, left: 47.2, map: `US` };
    case `Providence, Rhode Island`:
      return { top: 38.0, left: 62.3, map: `US` };
    case `Rahway, New Jersey`:
      return { top: 46.9, left: 52.6, map: `US` };
    case `Stanford, New York`:
      return { top: 37.6, left: 54.6, map: `US` };
    case `Cornwall, New York`:
      return { top: 41.6, left: 53.8, map: `US` };
    case `Wilmington, Delaware`:
      return { top: 53.6, left: 48.5, map: `US` };
    case `Flushing, Ohio`:
      return { top: 50.2, left: 30.9, map: `US` };
    case `Philadelphia, Pennsylvania`:
      return { top: 52.0, left: 49.9, map: `US` };
    case `Ruscombe, England`:
      return { top: 73.8, left: 56.9, map: `UK` };
    case `Little Musgrave, England`:
      return { top: 41.0, left: 51.2, map: `UK` };
    case `Allerthorpe, England`:
      return { top: 48.2, left: 57.6, map: `UK` };
    case `Amsterdam, Netherlands`:
      return { top: 64.5, left: 78.6, map: `UK` };
    case `Ulverstone, England`:
      return { top: 45.0, left: 48.4, map: `UK` };
    case `Edenderry, Ireland`:
      return { top: 54.3, left: 33.7, map: `UK` };
    case `Tottenham, England`:
      return { top: 72.3, left: 60.1, map: `UK` };
    case `Oxford, England`:
      return { top: 71.1, left: 55.4, map: `UK` };
    case `Liverpool, England`:
      return { top: 53.7, left: 48.9, map: `UK` };
    case `Liskeard, England`:
      return { top: 84.8, left: 43.5, map: `UK` };
    case `Warrington, England`:
      return { top: 53.8, left: 50.5, map: `UK` };
    case `Bridport, England`:
      return { top: 81.8, left: 49.5, map: `UK` };
    case `Welshpool, Wales`:
      return { top: 61.4, left: 48.3, map: `UK` };
    case `Abingdon, England`:
      return { top: 72.4, left: 55.3, map: `UK` };
    case `Lisburn, Ireland`:
      return { top: 41.4, left: 37.2, map: `UK` };
    case `Ballymore, Ireland`:
      return { top: 52.4, left: 31.3, map: `UK` };
    case `Ashford, England`:
      return { top: 77.4, left: 63.3, map: `UK` };
    case `Clonmel, Ireland`:
      return { top: 64.4, left: 31.3, map: `UK` };
    case `Birmingham, England`:
      return { top: 63.3, left: 53.0, map: `UK` };
    case `Peckham, England`:
      return { top: 74.6, left: 60.0, map: `UK` };
    case `Stourbridge, England`:
      return { top: 63.3, left: 51.1, map: `UK` };
    case `Norwich, England`:
      return { top: 62.3, left: 65.1, map: `UK` };
    case `Haltwhistle, England`:
      return { top: 35.8, left: 51.1, map: `UK` };
    case `Reading, England`:
      return { top: 74.4, left: 56.7, map: `UK` };
    case `Cirencester, England`:
      return { top: 71.8, left: 52.7, map: `UK` };
    case `Colchester, England`:
      return { top: 70.3, left: 63.3, map: `UK` };
    case `Chelmsford, England`:
      return { top: 71.3, left: 61.8, map: `UK` };
    case `Radnorshire, Wales`:
      return { top: 67.0, left: 47.6, map: `UK` };
    case `Monyash, England`:
      return { top: 56.0, left: 53.6, map: `UK` };
    case `York, England`:
      return { top: 47.3, left: 56.6, map: `UK` };
    case `Dublin, Ireland`:
      return { top: 53.9, left: 36.6, map: `UK` };
    case `Broughton, England`:
      return { top: 51.5, left: 58.2, map: `UK` };
    case `London, England`:
      return { top: 73.5, left: 59.5, map: `UK` };
    case `Sunderland, England`:
      return { top: 36.5, left: 54.9, map: `UK` };
    case `Whitehaven, England`:
      return { top: 41.0, left: 46.9, map: `UK` };
    case `Retford, England`:
      return { top: 54.3, left: 56.6, map: `UK` };
    case `Wakefield, England`:
      return { top: 51.0, left: 54.6, map: `UK` };
    case `Ballitore, Ireland`:
      return { top: 58.0, left: 34.3, map: `UK` };
    case `Mountmellick, Ireland`:
      return { top: 56.4, left: 32.6, map: `UK` };
    case `Cork, Ireland`:
      return { top: 69.7, left: 28.2, map: `UK` };
    case `Kendal, England`:
      return { top: 43.5, left: 49.7, map: `UK` };
    case `Moorside, England`:
      return { top: 51.5, left: 52.7, map: `UK` };
    case `Uxbridge, England`:
      return { top: 73.6, left: 58.6, map: `UK` };
    case `Shillingford, England`:
      return { top: 72.2, left: 55.7, map: `UK` };
    case `Jordans, England`:
      return { top: 72.5, left: 57.7, map: `UK` };
    case `Leicester, England`:
      return { top: 61.5, left: 56.1, map: `UK` };
    case `Sedbergh, England`:
      return { top: 44.0, left: 50.5, map: `UK` };
    case `Gloucester, England`:
      return { top: 70.0, left: 52.0, map: `UK` };
    case `Waterford, Ireland`:
      return { top: 66.0, left: 33.4, map: `UK` };
    case `Hemel Hempstead, England`:
      return { top: 71.6, left: 58.2, map: `UK` };
    case `Bromley, England`:
      return { top: 75.3, left: 60.2, map: `UK` };
    case `Carlisle, England`:
      return { top: 37.1, left: 48.8, map: `UK` };
    case `Bristol, England`:
      return { top: 74.1, left: 50.3, map: `UK` };
    case `Dudley, England`:
      return { top: 63.2, left: 52.2, map: `UK` };
    case `Bampton, England`:
      return { top: 71.2, left: 54.2, map: `UK` };
    case `Aberdeen, Scotland`:
      return { top: 11.2, left: 52.2, map: `UK` };
    case `Aberdeenshire, Scotland`:
      return { top: 12, left: 51.8, map: `UK` };
    default:
      throw new Error(`Unknown residence: ${place}`);
  }
}
