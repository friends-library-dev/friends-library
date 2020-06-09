import Cart from '../Cart';
import CartItem from '../CartItem';
import { cartItemData1, cartItemData2 } from './fixtures';

describe(`Cart`, () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart([new CartItem(cartItemData1())]);
  });

  test(`adding different cart item should increase num items`, () => {
    const newItem = new CartItem(cartItemData2());
    cart.addItem(newItem);
    expect(cart.items.length).toBe(2);
  });

  test(`adding same cart item should only increase quantity`, () => {
    const newItem = new CartItem(cartItemData1());
    cart.addItem(newItem);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(2);
  });
});
