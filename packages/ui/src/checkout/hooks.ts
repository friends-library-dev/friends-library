import { useState, useEffect } from 'react';
import CartStore from './services/CartStore';

const store = CartStore.getSingleton();

export function useNumCartItems(): [number, (numItems: number) => void, CartStore] {
  const [numItems, setNumItems] = useState<number>(store.cart.items.length);
  useEffect(() => {
    store.on('cart:changed', () => setNumItems(store.cart.items.length));
  }, []);
  return [numItems, setNumItems, store];
}
