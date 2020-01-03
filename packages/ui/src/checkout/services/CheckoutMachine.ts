import { EventEmitter } from 'events';
import { checkoutErrors as Err } from '@friends-library/types';
import CheckoutService from './CheckoutService';

const states = {
  cart: {
    async next(this: CheckoutMachine) {
      await this.transitionTo('delivery');
      // don't await, fire & forget to wakeup in background
      this.service.sendWakeup();
    },
    continueBrowsing(this: CheckoutMachine) {
      this.close();
    },
  },

  delivery: {
    next: 'calculateFees',
    back: 'cart',
  },

  calculateFees: {
    onEnter: 'Service.calculateFees',
    success: 'createOrder',
    failure(this: CheckoutMachine, err: string) {
      this.transitionTo(err === Err.SHIPPING_NOT_POSSIBLE ? 'delivery' : 'brickSession');
    },
  },

  createOrder: {
    onEnter: 'Service.createOrder',
    success: 'payment',
    failure: 'brickSession',
  },

  payment: {
    async next(
      this: CheckoutMachine,
      authorizePayment: () => Promise<Record<string, any>>,
    ) {
      await this.transitionTo('authorizingPayment');
      const err = await this.service.authorizePayment(authorizePayment);
      await this.dispatch(err ? 'failure' : 'success', err);
    },
    back: 'delivery',
  },

  authorizingPayment: {
    success: 'createPrintJob',
    failure(this: CheckoutMachine) {
      // we've got a user-actionable stripe error, display it on payment screen
      if (this.service.peekStripeError()) {
        this.transitionTo('payment');
        return;
      }
      // something went horribly wrong, brick session
      this.transitionTo('brickSession');
    },
  },

  createPrintJob: {
    onEnter: 'Service.createPrintJob',
    success: 'verifyPrintJob',
    failure: 'brickSession',
  },

  verifyPrintJob: {
    onEnter: 'Service.verifyPrintJobAccepted',
    success: 'updateOrderPrintJobStatus',
    failure: 'brickSession',
  },

  updateOrderPrintJobStatus: {
    onEnter: 'Service.updateOrderPrintJobStatus',
    success: 'capturePayment',
    failure: 'capturePayment',
  },

  capturePayment: {
    onEnter: 'Service.capturePayment',
    success: 'confirmation',
    failure: 'brickSession',
  },

  confirmation: {
    onEnter(this: CheckoutMachine) {
      this.service.sendOrderConfirmationEmail(); // fire & forget, no need to wait
      this.service.complete();
    },

    finish(this: CheckoutMachine) {
      this.close();
    },
  },

  /**
   * There are many possible errors that can happen during the lambda orchestration, most of which
   * are very rare, and probably not worth the effort at this point to graph out detailed recovery
   * scenarios. So, when we hit one of those rare, not-straightforward-how-to-handle errors, we
   * just `brick` the session -- cancel payment if authorized, set the order status to `bricked`,
   * clear most of the state on the CheckoutService, show them a sad message, and let them start again.
   * As these events trickle in from production, I can plan out remediation for common errors.
   */
  brickSession: {
    onEnter(this: CheckoutMachine) {
      this.service.brickOrder(this.history);
    },
    tryAgain: 'cart',
    close(this: CheckoutMachine) {
      this.close();
    },
  },

  closed: {
    next: 'cart',
  },
};

type StateKey = keyof typeof states;

export default class CheckoutMachine extends EventEmitter {
  public history: StateKey[] = ['cart'];
  public state: StateKey = 'cart';

  public constructor(public service: CheckoutService) {
    super();
  }

  public getState(): string {
    return this.state;
  }

  public close(): void {
    this.emit('close');
    this.transitionTo('closed');
    this.dispatch('next');
  }

  public async transitionTo(state: StateKey): Promise<void> {
    log(`%ctransition to state: %c${state}`, 'color: grey', 'color: green');
    const nextState = states[state];
    if (!nextState) {
      throw new Error(`Unexpected next state: ${state}`);
    }

    this.state = state;
    this.history.push(state);
    this.emit('state:change', state);

    if (!nextState.hasOwnProperty('onEnter')) {
      return;
    }

    // @ts-ignore
    const { onEnter } = nextState;
    if (typeof onEnter === 'function') {
      await onEnter.call(this);
      return;
    }

    if (typeof onEnter === 'string' && onEnter.startsWith('Service.')) {
      const method = onEnter.replace(/^Service\./, '');
      // @ts-ignore
      if (typeof this.service[method] !== 'function') {
        throw new Error(`CheckoutService method: ${method} does not exist`);
      }
      // @ts-ignore
      const err = await this.service[method]();
      await this.dispatch(err ? 'failure' : 'success', err);
      return;
    }

    throw new Error('Unexpected value for [state].onEnter');
  }

  public async dispatch<T>(action: string, payload?: T): Promise<void> {
    log(`%cdispatch action: %c${action}`, 'color: grey', 'color: orange');
    const state = states[this.state];
    if (!state) {
      return;
    }

    // @ts-ignore
    const handler = state[action];
    if (handler === undefined) {
      return;
    }

    if (typeof handler === 'function') {
      handler.call(this, payload);
      return;
    }

    await this.transitionTo(handler);
  }
}

const log: any =
  process?.env?.NODE_ENV === 'production' ? (): void => {} : console.log.bind(console);
