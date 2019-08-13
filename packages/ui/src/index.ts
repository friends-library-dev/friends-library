import { en as enTheme, es as esTheme } from './theme';
export { default as Nav } from './Nav';
export { default as Tailwind } from './Tailwind';
export { default as styled } from './styled';
export { default as WhoWereTheQuakers } from './blocks/WhoWereTheQuakers';
export { t, useLocale } from './translation';
export { enTheme, esTheme };
export type Theme = typeof enTheme;
