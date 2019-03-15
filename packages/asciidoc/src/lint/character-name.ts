import unicharadata from 'unicharadata';

export default function characterName(char: string): string {
  return unicharadata.lookupname(char);
}
