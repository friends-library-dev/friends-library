import { EditionType } from '@friends-library/types';

export interface Address {
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CartItem {
  title: string;
  author: string;
  edition: EditionType;
  quantity: number;
  price: number;
}
