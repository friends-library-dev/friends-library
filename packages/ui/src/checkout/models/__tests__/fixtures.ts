import CartItem, { CartItemData } from '../CartItem';
import { Address } from '../../types';
import Cart from '../Cart';

export const cartItemData1: () => CartItemData = () => ({
  title: 'Journal of George Fox',
  author: 'George Fox',
  documentId: 'e5a1ecfb-4f0a-4c71-80bf-3ee924d0f46c',
  edition: 'original',
  printSize: 'xl',
  quantity: 1,
  numPages: 516,
  interiorPdfUrl: '/GF.pdf',
  coverPdfUrl: '/GF--cover.pdf',
});

export const cartItemData2: () => CartItemData = () => ({
  title: 'Walk in the Spirit',
  documentId: '9333dd0a-d92b-401e-a086-f611cc20f984',
  author: 'Hugh Turford',
  edition: 'updated',
  printSize: 's',
  quantity: 3,
  numPages: 113,
  interiorPdfUrl: '/HT.pdf',
  coverPdfUrl: '/HT--cover.pdf',
});

export const cartItemsData: () => [CartItemData, CartItemData] = () => [
  cartItemData1(),
  cartItemData2(),
];

export const address: () => Address = () => ({
  name: 'Jared Henderson',
  street: '8206 Wilhite Dr.',
  city: 'Wadsworth',
  state: 'OH',
  zip: '44281',
  country: 'US',
});

export const cartItem1: () => CartItem = () => new CartItem(cartItemData1());

export const cartItem2: () => CartItem = () => new CartItem(cartItemData2());

export const emptyCartPlusData: () => Cart = () =>
  new Cart([], address(), 'jared@netrivet.com');

export const cartPlusData: () => Cart = () =>
  new Cart([cartItem1(), cartItem2()], address(), 'jared@netrivet.com');

export const emptyCart: () => Cart = () => new Cart([]);

export const cart: () => Cart = () => new Cart([cartItem1(), cartItem2()]);
