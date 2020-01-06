export function releaseFocus(): void {
  try {
    // @ts-ignore
    setTimeout(() => document.activeElement?.blur(), 0);
  } catch (e) {
    // ¯\_(ツ)_/¯
  }
}
