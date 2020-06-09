export function makeScroller(selector: string, padding = 0): () => void {
  return () => {
    const element = document.querySelector(selector);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      window.scrollTo({
        top: elementRect.top - FIXED_TOPNAV_HEIGHT + window.scrollY - padding,
        behavior: `smooth`,
      });
    }
  };
}

const FIXED_TOPNAV_HEIGHT = 70;
