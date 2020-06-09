import { EventEmitter } from 'events';
import Cookies from 'js-cookie';
import Cart from '../models/Cart';

export default class CartStore extends EventEmitter {
  private _isOpen = false;
  private stripeLoaded = false;
  public cart: Cart;

  public constructor() {
    super();
    this.cart = new Cart([]);

    try {
      const stored = JSON.parse(Cookies.get(`flp-cart`) || ``);
      if (stored) {
        this.cart = Cart.fromJson(stored);
      }
    } catch (e) {
      // ¯\_(ツ)_/¯
    }

    this.cart.on(`change`, () => {
      Cookies.set(`flp-cart`, JSON.stringify(this.cart.toJSON()));
      this.emit(`cart:changed`);
    });

    this.cart.on(`add-item`, () => this.emit(`cart:item-added`));
  }

  public isOpen(): boolean {
    return this._isOpen;
  }

  public close(): void {
    this._isOpen = false;
    this.emit(`hide`);
    this.emit(`toggle:visibility`, false);
  }

  public open(): void {
    this._isOpen = true;
    this.emit(`show`);
    this.emit(`toggle:visibility`, true);
    if (!this.stripeLoaded) {
      this.loadStripe();
    }
  }

  public static getSingleton(): CartStore {
    if (!singleton) {
      singleton = new CartStore();
    }
    return singleton;
  }

  private loadStripe(): void {
    const script = document.createElement(`script`);
    script.src = `https://js.stripe.com/v3/`;
    document.head.appendChild(script);
    this.stripeLoaded = true;
  }
}

let singleton: CartStore | undefined;
