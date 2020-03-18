import { Document } from '@friends-library/friends';

export function documentRegion(doc: Document): string {
  if (doc.region) {
    return doc.region;
  }
  const residence = doc.friend.primaryResidence;
  switch (residence.region) {
    case 'Ireland':
    case 'England':
    case 'Scotland':
      return residence.region;
    case 'Wales':
    case 'Netherlands':
    case 'mixed (compilation)':
      return 'Other';
    case 'Ohio':
      return 'Western US';
    case 'Delaware':
    case 'Pennsylvania':
    case 'New Jersey':
    case 'Rhode Island':
    case 'New York':
      return 'Eastern US';
    default:
      throw new Error(`Error inferring explore region from doc: ${doc.path}`);
  }
}
