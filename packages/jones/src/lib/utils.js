// @flow

export function values<T>(obj: { [string]: T }): Array<T> {
  return Object.keys(obj).map(k => obj[k]);
}

