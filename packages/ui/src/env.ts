import { Lang } from '@friends-library/types';

const LANG: Lang = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

export { LANG };
