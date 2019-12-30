import { checkoutErrors as Err } from '@friends-library/types';
import CheckoutService from './CheckoutService';

export default class CheckoutMachine {
  private history = ['cart'];
  private state = 'cart';
  private listeners: ((newState: string) => void)[] = [];

  public constructor(public service: CheckoutService) {}

  private states = {
    hidden: {
      show: 'cart',
    },

    cart: {
      async next(this: CheckoutMachine) {
        await this.transitionTo('delivery');
        // don't await, fire & forget to wakeup in background
        this.service.sendWakeup();
      },
      close: 'hidden',
    },

    delivery: {
      next: 'calculateFees',
    },

    calculateFees: {
      onEnter: 'Service.calculateFees',
      success: 'createOrder',
      failure(this: CheckoutMachine, err: string) {
        this.transitionTo(
          err === Err.SHIPPING_NOT_POSSIBLE ? 'delivery' : 'brickSession',
        );
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
    },

    authorizingPayment: {
      success: 'createPrintJob',
      failure: 'payment',
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
      success(this: CheckoutMachine) {
        this.transitionTo('confirmation');
        this.service.sendOrderConfirmationEmail(); // fire & forget, no need to wait
      },
      failure: 'brickSession',
    },

    confirmation: {
      onEnter(this: CheckoutMachine) {
        // @TODO reset cart completely, keep address @BLOCKER
      },
      finish: 'hidden',
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
      close: 'hidden',
    },
  };

  public getState(): string {
    return this.state;
  }

  public listen(listener: (newState: string) => void): void {
    this.listeners.push(listener);
  }

  public async transitionTo(state: string): Promise<void> {
    log(`%ctransition to state: %c${state}`, 'color: grey', 'color: green');
    const nextState = this.states[state];
    if (!nextState) {
      throw new Error(`Unexpected next state: ${state}`);
    }

    this.state = state;
    this.history.push(state);
    this.listeners.forEach(listener => listener(state));

    if (typeof nextState.onEnter === 'undefined') {
      return;
    }

    const { onEnter } = nextState;
    if (typeof onEnter === 'function') {
      await onEnter.call(this);
      return;
    }

    // support `Service.[method] shorthand for invoking no-argument service fns
    if (typeof onEnter === 'string' && onEnter.startsWith('Service.')) {
      const method = onEnter.replace(/^Service\./, '');
      if (typeof this.service[method] !== 'function') {
        throw new Error(`CheckoutService method: ${method} does not exist`);
      }
      const err = await this.service[method]();
      await this.dispatch(err ? 'failure' : 'success', err);
      return;
    }

    throw new Error('Unexpected value for [state].onEnter');
  }

  public async dispatch<T>(action: string, payload?: T): Promise<void> {
    log(`%cdispatch action: %c${action}`, 'color: grey', 'color: orange');
    const state = this.states[this.state];
    if (!state) {
      return;
    }

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
