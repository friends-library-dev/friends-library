// @flow

export function values<T>(obj: { [string]: T }): Array<T> {
  return Object.keys(obj).map(k => obj[k]);
}


export const noopObject: * = new Proxy({}, {
  get(target, prop, receiver) {
    const fn = () => receiver;
    Object.setPrototypeOf(fn, receiver);
    return fn;
  },
});
