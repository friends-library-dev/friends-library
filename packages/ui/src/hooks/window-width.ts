import { useState, useEffect } from 'react';

export function useWindowWidth(): number {
  const [winWidth, setWinWidth] = useState<number>(-1);

  useEffect(() => {
    setWinWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const updateWinWidth: () => any = () => setWinWidth(window.innerWidth);
    window.addEventListener(`resize`, updateWinWidth);
    return () => window.removeEventListener(`resize`, updateWinWidth);
  });

  return winWidth;
}
