import { Lang, Html } from '@friends-library/types';

export const br7 = `<br class="m7"/>`;

export function ucfirst(lower: string): string {
  return lower.replace(/^\w/, c => c.toUpperCase());
}

const smallEn = `a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|via`.split(`|`);
const smallEs = `a|un|una|el|la|los|las|y|e|o|con|de|del|al|por|si|en`.split(`|`);

export function capitalizeTitle(str: string, lang: Lang): string {
  const small = lang === `en` ? smallEn : smallEs;
  return str
    .split(` `)
    .map((word, index, parts) => {
      if (index === 0 || index === parts.length - 1) {
        return ucfirst(word);
      }
      return small.includes(word.toLowerCase()) ? word : ucfirst(word);
    })
    .join(` `);
}

export function trimTrailingPunctuation(str: string): string {
  return str.replace(/(?<!etc)[.,]$/, ``);
}

export function removeMobi7Tags(html: Html): Html {
  return html
    .replace(/ *<br class="m7" *\/>\n?/gim, ``)
    .replace(/ *<span class="m7">.+?<\/span>\n?/gim, ``);
}
