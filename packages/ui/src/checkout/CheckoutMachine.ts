import { Address, CartItem } from './types';

export default class CheckoutMachine {
  private listeners: ((newState: string) => void)[] = [];

  private state = 'cart';

  private states = {
    hidden: {
      show: 'cart',
    },

    cart: {
      next: 'costExplanation',
    },

    costExplanation: {
      next: 'collectEmail',
    },

    collectEmail: {
      next: 'collectAddress',
    },

    collectAddress: {
      async next(
        this: CheckoutMachine,
        {
          setShipping,
        }: {
          address: Address;
          cart: CartItem[];
          setShipping: (shipping: number) => void;
        },
      ) {
        this.transitionTo('calculatingShipping');
        setShipping(await fakeService(4.11));
        this.dispatch('success');
      },
    },

    calculatingShipping: {
      success: 'confirmShipping',
    },

    confirmShipping: {
      backToCart: 'cart',
      next: 'collectCreditCart',
    },

    collectCreditCart: {
      async next(this: CheckoutMachine) {
        this.transitionTo('authorizingPayment');
        await fakeService(null);
        this.dispatch('success');
      },
    },

    authorizingPayment: {
      async success(this: CheckoutMachine) {
        this.transitionTo('submittingToPrinter');
        await fakeService(null);
        this.dispatch('success');
      },
    },

    submittingToPrinter: {
      async success(this: CheckoutMachine) {
        this.transitionTo('validatingPrintOrder');
        await fakeService(null);
        this.dispatch('success');
      },
    },

    validatingPrintOrder: {
      async success(this: CheckoutMachine) {
        this.transitionTo('capturingPayment');
        await fakeService(null);
        this.dispatch('success');
      },
    },

    capturingPayment: {
      success: 'success',
    },
  };

  public getState(): string {
    return this.state;
  }

  public listen(listener: (newState: string) => void): void {
    this.listeners.push(listener);
  }

  public transitionTo(state: string): void {
    this.state = state;
    this.listeners.forEach(listener => listener(state));
  }

  public dispatch<T>(action: string, payload?: T): void {
    const state = this.states[this.state];
    if (!state) {
      return;
    }

    const handler = state[action];
    if (handler === undefined) {
      return;
    }

    if (typeof handler === 'string') {
      this.transitionTo(handler);
      return;
    }

    console.log({ payload });
    handler.call(this, payload);
  }
}

function fakeService<T>(value: T, ms: number = 2000): Promise<T> {
  return new Promise(res => setTimeout(() => res(value), ms));
}
