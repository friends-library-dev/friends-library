import { EventEmitter } from 'events';
import CartItem, { CartItemData } from './CartItem';
import { Address } from '../types';

interface CartData {
  items: CartItemData[];
  address?: Address;
  email?: string;
}

export default class Cart extends EventEmitter {
  public static fromJson(json: CartData): Cart {
    const cart = new Cart(
      json.items
        .map(itemData => {
          // Temporary migration of cart data from legacy format
          // remove after Oct 1, 2020
          if (Array.isArray(itemData.title)) {
            itemData.title = itemData.title[0];
          }
          return itemData;
        })
        .map(itemData => new CartItem(itemData)),
      json.address,
      json.email,
    );

    return cart;
  }

  public constructor(
    private _items: CartItem[],
    public address?: Address,
    public email?: string,
  ) {
    super();
  }

  public set items(items: CartItem[]) {
    this._items = items;
    this.emit(`change`);
  }

  public get items(): CartItem[] {
    return this._items;
  }

  public numItems(): number {
    return this.items.length;
  }

  public totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public addItem(newItem: CartItem): void {
    for (const item of this.items) {
      if (item.equals(newItem)) {
        item.quantity++;
        this.emit(`change`);
        this.emit(`add-item`);
        return;
      }
    }
    this._items.push(newItem);
    this.emit(`change`);
    this.emit(`add-item`);
  }

  public subTotal(): number {
    return this.items.reduce((st, item) => st + item.price() * item.quantity, 0);
  }

  public toJSON(): CartData {
    return {
      items: this.items.map(item => item.toJSON()),
      ...(this.address ? { address: this.address } : {}),
      ...(this.email ? { email: this.email } : {}),
    };
  }
}
