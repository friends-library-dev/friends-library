import { PrintSize } from '@friends-library/types';
import CartItem from '../CartItem';
import { cartItemData1 } from './fixtures';

describe('CartItem()', () => {
  const priceCases: [number, PrintSize, number][] = [
    [214, 's', 10],
    [265, 's', 100],
    [265, 'm', 100],
    [405, 'm', 200],
    [685, 'xl', 400],
  ];

  test.each(priceCases)(
    '.price() is %d for size: %s, pages: %d',
    (price, printSize, numPages) => {
      const item = new CartItem({ ...cartItemData1(), printSize, numPages });
      expect(item.price()).toBe(price);
    },
  );
});
