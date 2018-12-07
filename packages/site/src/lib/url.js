// @flow
import type { Slug, Gender, Url } from '../../../../type';
import { LANG } from '../env';

export function friendUrl(slug: Slug, gender: Gender): Url {
  if (slug === 'compilations') {
    return '/compilations'; // @TODO translate
  }

  if (LANG === 'en') {
    return `/friend/${slug}`;
  }

  const amigo = gender === 'male' ? 'amigo' : 'amiga';
  return `/${amigo}/${slug}`;
}
