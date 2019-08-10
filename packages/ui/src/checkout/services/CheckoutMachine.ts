import Cart from '../models/Cart';
import CheckoutService from './CheckoutService';

export default class CheckoutMachine {
  private state = 'cart';
  private listeners: ((newState: string) => void)[] = [];

  public constructor(public cart: Cart, public service: CheckoutService) {}

  private states = {
    hidden: {
      show: 'cart',
    },

    cart: {
      next(this: CheckoutMachine) {
        this.transitionTo('costExplanation');
        this.service.sendWakeup();
      },
    },

    costExplanation: {
      next: 'collectEmail',
    },

    collectEmail: {
      next: 'collectAddress',
    },

    collectAddress: {
      async next(this: CheckoutMachine) {
        this.transitionTo('calculatingFees');
        const [err] = await this.service.calculateFees(this.cart);
        this.dispatch(err ? 'failure' : 'success', err || undefined);
      },
    },

    calculatingFees: {
      success: 'confirmFees',
    },

    confirmFees: {
      backToCart: 'cart',
      next: 'collectCreditCart',
    },

    collectCreditCart: {
      async next(this: CheckoutMachine, getToken: () => Promise<string>) {
        this.transitionTo('fetchingPaymentToken');
        try {
          const token = await getToken();
          this.dispatch('success', token);
        } catch {
          this.dispatch('failure');
        }
      },
    },

    fetchingPaymentToken: {
      async success(this: CheckoutMachine, token: string) {
        this.transitionTo('authorizingPayment');
        const [err] = await this.service.createOrderAndAuthorizePayment(this.cart, token);
        this.dispatch(err ? 'failure' : 'success', err || undefined);
      },
    },

    authorizingPayment: {
      async success(this: CheckoutMachine) {
        this.transitionTo('submittingToPrinter');
        const [err] = await this.service.createPrintJob(this.cart);
        this.dispatch(err ? 'failure' : 'success', err || undefined);
      },
    },

    submittingToPrinter: {
      async success(this: CheckoutMachine) {
        this.transitionTo('validatingPrintOrder');
        const [err] = await this.service.verifyPrintJobAccepted();
        this.dispatch(err ? 'failure' : 'success', err || undefined);
      },
    },

    validatingPrintOrder: {
      async success(this: CheckoutMachine) {
        this.transitionTo('updateOrderPrintJobStatus');
        const [err] = await this.service.updateOrderPrintJobStatus();
        this.dispatch(err ? 'failure' : 'success', err || undefined);
      },
    },

    updateOrderPrintJobStatus: {
      async success(this: CheckoutMachine) {
        this.transitionTo('capturingPayment');
        const [err] = await this.service.capturePayment();
        this.dispatch(err ? 'failure' : 'success', err || undefined);
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
    console.log(`%ctransition to state: %c${state}`, 'color: grey', 'color: green');
    this.state = state;
    this.listeners.forEach(listener => listener(state));
  }

  public dispatch<T>(action: string, payload?: T): void {
    console.log(`%cdispatch action: %c${action}`, 'color: grey', 'color: orange');
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

    handler.call(this, payload);
  }
}
