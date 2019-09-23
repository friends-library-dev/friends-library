import React from 'react';
import { Html } from '@friends-library/types';

export function overridable(
  key: string,
  fragments: Record<string, Html>,
  fallback: JSX.Element,
): JSX.Element {
  if (fragments[key] !== undefined) {
    return React.createElement(key === 'blurb' ? 'div' : fallback.type, {
      className: key,
      dangerouslySetInnerHTML: { __html: fragments[key] },
    });
  }
  return fallback;
}
