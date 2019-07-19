// @ts-ignore
import frags from './built-frags.json';

export function html(id: string): string {
  return (<{ [k: string]: any }>frags)[id].html || '';
}

export function adoc(id: string): string {
  return (<{ [k: string]: any }>frags)[id].adoc || '';
}
