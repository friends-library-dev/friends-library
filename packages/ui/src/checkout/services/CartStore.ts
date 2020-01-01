import { EventEmitter } from 'events';
import Cart from '../models/Cart';

export default class CartStore extends EventEmitter {
  private _isOpen = false;
  public cart: Cart;

  public constructor() {
    super();
    this.cart = new Cart([]);
    this.cart.on('change', () => this.emit('cart:changed'));
  }

  public isOpen(): boolean {
    return this._isOpen;
  }

  public close(): void {
    this._isOpen = false;
    this.emit('hide');
  }

  public open(): void {
    this._isOpen = true;
    this.emit('show');
  }

  public static getSingleton(): CartStore {
    if (!singleton) {
      singleton = new CartStore();
    }
    return singleton;
  }
}

let singleton: CartStore | undefined;
