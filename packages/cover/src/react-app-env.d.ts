/// <reference types="react-scripts" />

declare module 'browser-or-node' {
  const isBrowser: boolean;
  const isNode: boolean;
  export { isBrowser, isNode };
}
