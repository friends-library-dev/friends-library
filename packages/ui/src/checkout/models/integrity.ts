import { isEdition, isPrintSize } from '@friends-library/types';
import { CartItemData } from './CartItem';
import { Address } from '../types';

export function isAddress(obj: unknown): obj is Address {
  try {
    if (typeof obj !== `object` || obj === null) {
      return false;
    }

    const strings = [`name`, `street`, `city`, `state`, `zip`, `country`];
    for (const str of strings) {
      // @ts-ignore
      if (typeof obj[str] !== `string`) {
        return false;
      }
    }

    // @ts-ignore
    if (![`undefined`, `string`].includes(typeof obj.street2)) {
      return false;
    }
    // @ts-ignore
    if (![`undefined`, `boolean`].includes(typeof obj.unusable)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export function isItem(item: unknown): item is CartItemData {
  try {
    if (typeof item !== `object` || item === null) {
      return false;
    }

    const { edition, quantity, printSize, numPages } = item as Record<string, unknown>;
    for (const prop of [`displayTitle`, `documentId`, `title`, `author`]) {
      // @ts-ignore
      if (typeof item[prop] !== `string`) {
        return false;
      }
    }

    if (!isEdition(edition) || !isPrintSize(printSize)) {
      return false;
    }

    if (typeof quantity !== `number`) {
      return false;
    }

    if (!Array.isArray(numPages)) {
      return false;
    }

    for (const pages of numPages as unknown[]) {
      if (typeof pages !== `number`) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * In the work in/around ffe4d38 (7/10/20) the stored `item.title` moved
 * from being an array of strings to just a string. This prevents
 * errors for those who had a cart cookied spanning that transition.
 * This can probably be safely removed in a few months, as the validation
 * steps will ensure no errors, the worst that could happen is their cart
 * would suddenly be empty.
 */
export function migrateArrayTitle(item: unknown): unknown {
  try {
    if (typeof item !== `object` || item === null) {
      return item;
    }

    const titled = item as { title: unknown };
    const { title } = titled;
    if (Array.isArray(title) && typeof title[0] === `string`) {
      titled.title = title[0];
    }
  } catch (err) {
    // ¯\_(ツ)_/¯
  }
  return item;
}
