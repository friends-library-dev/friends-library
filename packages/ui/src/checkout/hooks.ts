import { useState, useEffect } from 'react';
import CartStore from './services/CartStore';

const store = CartStore.getSingleton();

export function useNumCartItems(): [number, (numItems: number) => void, CartStore] {
  const [numItems, setNumItems] = useState<number>(store.cart.numItems());
  useEffect(() => {
    store.on('cart:changed', () => setNumItems(store.cart.numItems()));
  }, []);
  return [numItems, setNumItems, store];
}

export function useCartTotalQuantity(): [number, (qty: number) => void, CartStore] {
  const [quantity, setQuantity] = useState<number>(store.cart.totalQuantity());
  useEffect(() => {
    store.on('cart:changed', () => setQuantity(store.cart.totalQuantity()));
  }, []);
  return [quantity, setQuantity, store];
}
