import CartItem, { CartItemData } from '../CartItem';
import { Address } from '../../types';
import Cart from '../Cart';

export const cartItemData1: () => CartItemData = () => ({
  displayTitle: `Journal of George Fox`,
  title: `Journal of George Fox`,
  author: `George Fox`,
  documentId: `e5a1ecfb-4f0a-4c71-80bf-3ee924d0f46c`,
  edition: `original`,
  printSize: `xl`,
  quantity: 1,
  numPages: [516],
});

export const cartItemData2: () => CartItemData = () => ({
  displayTitle: `Journal of T. Shillitoe &mdash; Vol. I`,
  title: `Journal of T. Shillitoe`,
  documentId: `9333dd0a-d92b-401e-a086-f611cc20f984`,
  author: `Thomas Shillitoe`,
  edition: `updated`,
  printSize: `xl`,
  quantity: 3,
  numPages: [543, 599],
});

export const cartItemData3: () => CartItemData = () => ({
  displayTitle: `The Journal and Writings of Ambrose Rigge`,
  title: `The Journal and Writings of Ambrose Rigge`,
  documentId: `f6b0e134d-8d2e-48bc-8fa3-e8fc79793804`,
  author: `Ambrose Rigge`,
  edition: `modernized`,
  printSize: `m`,
  quantity: 1,
  numPages: [227],
});

export const cartItemsData: () => [CartItemData, CartItemData] = () => [
  cartItemData1(),
  cartItemData2(),
];

export const address: () => Address = () => ({
  name: `Jared Henderson`,
  street: `8206 Wilhite Dr.`,
  city: `Wadsworth`,
  state: `OH`,
  zip: `44281`,
  country: `US`,
  email: `you@example.com`,
});

export const cartItem1: () => CartItem = () => new CartItem(cartItemData1());

export const cartItem2: () => CartItem = () => new CartItem(cartItemData2());

export const emptyCartPlusData: () => Cart = () =>
  new Cart([], address(), `jared@netrivet.com`);

export const cartPlusData: () => Cart = () =>
  new Cart([cartItem1(), cartItem2()], address(), `jared@netrivet.com`);

export const emptyCart: () => Cart = () => new Cart([]);

export const cart: () => Cart = () => new Cart([cartItem1(), cartItem2()]);
