import React from 'react';
import cx from 'classnames';
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ReactStripeElements,
} from 'react-stripe-elements';
import Back from './Back';
import Header from './Header';
import Progress from './Progress';
import NoProfit from './NoProfit';
import Button from '../Button';
import Fees from './Fees';
import { InvalidOverlay } from './Input';
import { CardRow, FeedbackCard } from './Cards';
import MessageThrobber from './MessageThrobber';

type Props = ReactStripeElements.InjectedStripeProps & {
  onBack: () => void;
  subTotal: number;
  shipping: number;
  taxes: number;
  ccFeeOffset: number;
  throbbing: boolean;
  onPay: (authorizePayment: () => Promise<Record<string, any>>) => void;
  paymentIntentClientSecret: string;
};

interface State {
  cardBrand?: string;
  numberComplete: boolean;
  expiryComplete: boolean;
  cvcComplete: boolean;
  numberError?: string;
  expiryError?: string;
  cvcError?: string;
}

class Payment extends React.Component<Props, State> {
  public state: State = {
    numberComplete: false,
    expiryComplete: false,
    cvcComplete: false,
  };

  private handleSubmit: (
    ev: React.FormEvent<HTMLFormElement>,
  ) => Promise<void> = async ev => {
    ev.preventDefault();
    if (!this.valid() || this.props.throbbing) {
      return;
    }

    const { paymentIntentClientSecret, stripe, elements, onPay } = this.props;
    if (!stripe || !elements) {
      throw new Error('Missing stripe prop!');
    }

    onPay(() =>
      // @ts-ignore
      stripe.confirmCardPayment(paymentIntentClientSecret, {
        payment_method: {
          card: elements.getElement('cardNumber'),
        },
      }),
    );
  };

  private valid: () => boolean = () => {
    return (
      this.state.numberComplete &&
      !this.state.numberError &&
      this.state.cvcComplete &&
      !this.state.cvcError &&
      this.state.expiryComplete &&
      !this.state.expiryError
    );
  };

  public render(): JSX.Element {
    const { throbbing, onBack } = this.props;
    const { numberError, cardBrand, expiryError, cvcError } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Header>Payment</Header>
        <NoProfit className="hidden md:block" />
        <Progress step="Payment" />
        <div className="relative">
          {throbbing && <MessageThrobber />}
          <div className={cx('md:flex mt-4', throbbing && 'blur pointer-events-none')}>
            <Fees
              className="w-full md:w-1/2 md:mr-10 md:border-b md:pb-2 md:mb-4"
              {...this.props}
            />
            <div className="md:w-1/2 mt-4 md:mt-0">
              <h3 className="hidden md:block pt-0 mt-2 mb-6 text-gray-600 antialiased tracking-wider font-sans font-normal text-lg">
                Enter credit card details:
              </h3>
              <div className="relative">
                <CardNumberElement
                  className={cx('CartInput', { invalid: !!numberError })}
                  placeholder="Credit Card Number"
                  onReady={el => el.focus()}
                  onChange={({ error, brand, complete }) => {
                    this.setState({
                      cardBrand: brand,
                      numberError: error ? error.message : undefined,
                      numberComplete: complete,
                    });
                  }}
                  onFocus={() => this.setState({ numberError: undefined })}
                  style={style}
                />
                {numberError && <InvalidOverlay>{numberError}</InvalidOverlay>}
                {!numberError && <FeedbackCard brand={cardBrand} />}
              </div>
              <div className="flex justify-between md:mt-6">
                <div className="relative mr-4 w-1/2 flex-grow">
                  <CardExpiryElement
                    style={style}
                    className={cx('CartInput', { invalid: !!expiryError })}
                    onFocus={() => this.setState({ expiryError: undefined })}
                    onChange={({ error, complete }) => {
                      this.setState({
                        expiryError: error ? error.message : undefined,
                        expiryComplete: complete,
                      });
                    }}
                  />
                  {expiryError && <InvalidOverlay>{expiryError}</InvalidOverlay>}
                </div>
                <div className="relative w-1/2">
                  <CardCvcElement
                    style={style}
                    placeholder="CVC"
                    className={cx('CartInput', { invalid: !!cvcError })}
                    onFocus={() => this.setState({ cvcError: undefined })}
                    onChange={({ error, complete }) => {
                      this.setState({
                        cvcError: error ? error.message : undefined,
                        cvcComplete: complete,
                      });
                    }}
                  />
                  {cvcError && <InvalidOverlay>{cvcError}</InvalidOverlay>}
                </div>
              </div>
              <div className="mb-6 mt-1 md:mt-2">
                <CardRow />
              </div>
            </div>
          </div>
        </div>
        <div className={cx(throbbing && 'blur pointer-events-none')}>
          <Back onClick={onBack}>Back to delivery</Back>
          <Button
            className={cx('mx-auto', {
              'bg-gray-800': !this.valid(),
              'bg-flprimary': this.valid(),
            })}
            disabled={!this.valid()}
          >
            Purchase
          </Button>
        </div>
      </form>
    );
  }
}

export default injectStripe(Payment);

const style = {
  base: {
    color: '#666',
    fontWeight: 500,
    fontFamily: 'Cabin, Open Sans, Segoe UI, sans-serif',
    fontSize: '16px',
    letterSpacing: '0.05em',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#ccc',
    },
  },
  complete: {
    color: '#106314',
  },
  invalid: {
    '::placeholder': {
      color: '#fff',
    },
  },
};
