// @flow
import { addLocale, useLocale } from 'c-3po';
import { readFileSync } from 'fs';
import gt from 'gettext-parser';
import { LANG } from 'env';


export function setLocale(): void {
  if (LANG === 'es') {
    addLocale('es', gt.po.parse(readFileSync('./es.po')));
    useLocale('es');
  }
}
