import { useEffect } from 'react';

export function useEscapeable(
  selector: string,
  isOpen: boolean,
  setIsOpen: (newVal: boolean) => any,
): void {
  useEffect(() => {
    const node = document.querySelector(selector);
    const click: (event: any) => any = (event) => {
      if (isOpen && node && !node.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const escape: (e: KeyboardEvent) => any = ({ keyCode }) => {
      isOpen && keyCode === 27 && setIsOpen(false);
    };
    document.addEventListener(`click`, click);
    document.addEventListener(`keydown`, escape);
    return () => {
      document.removeEventListener(`click`, click);
      window.removeEventListener(`keydown`, escape);
    };
  }, [isOpen, setIsOpen, selector]);
}
