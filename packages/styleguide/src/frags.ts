// @ts-ignore
import frags from './built-frags.json';

export function html(id: string): string {
  return (frags as { [k: string]: any })[id].html || ``;
}

export function adoc(id: string): string {
  return (frags as { [k: string]: any })[id].adoc || ``;
}
