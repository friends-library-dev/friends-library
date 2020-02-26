export function makeScroller(selector: string): () => void {
  return () => {
    let element = document.querySelector(selector);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      window.scrollTo({
        top: elementRect.top - FIXED_TOPNAV_HEIGHT + window.scrollY,
        behavior: 'smooth',
      });
    }
  };
}

const FIXED_TOPNAV_HEIGHT = 70;
