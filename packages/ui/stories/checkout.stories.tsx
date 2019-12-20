import React from 'react';
import { storiesOf } from '@storybook/react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { action as a } from '@storybook/addon-actions';
import { ThreeD } from '@friends-library/cover-component';
import Modal from '../src/checkout/Modal';
import MessageThrobber from '../src/checkout/MessageThrobber';
import CostExplanation from '../src/checkout/CostExplanation';
import CollectEmail from '../src/checkout/CollectEmail';
import CollectAddress from '../src/checkout/CollectAddress';
import Payment from '../src/checkout/Payment';
import Input from '../src/checkout/Input';
import EmptyCart from '../src/checkout/EmptyCart';
import Progress from '../src/checkout/Progress';
import Success from '../src/checkout/Success';
import ConfirmFees from '../src/checkout/ConfirmFees';
import { coverSizes } from './decorators';
import { props as coverProps } from './cover.stories';

storiesOf('Checkout Components', module)
  .addDecorator(coverSizes)
  .add('EmptyCart', () => (
    <EmptyCart
      recommendedBooks={[
        {
          title: 'No Cross, No Crown',
          path: '/',
          Cover: <ThreeD {...coverProps} scaler={0.25} scope="1-4" />,
        },
        {
          title: 'Journal of George Fox',
          path: '/',
          Cover: (
            <ThreeD {...coverProps} edition="modernized" scaler={0.25} scope="1-4" />
          ),
        },
        {
          title: 'The Work of Vital Religion in the Soul',
          path: '/',
          Cover: <ThreeD {...coverProps} edition="original" scaler={0.25} scope="1-4" />,
        },
      ]}
    />
  ))
  .add('Payment', () => (
    <div className="p-8">
      <StripeProvider apiKey="pk_test_DAZbsOWXXbvBe51IEVvVfc4H">
        <Elements>
          <Payment
            onPay={a('on pay')}
            onConfirm={a('on confirm')}
            onBackToCart={a('on back to cart')}
            subTotal={1298}
            shipping={399}
            taxes={132}
            ccFeeOffset={42}
            paymentIntentClientSecret="pi_123_secret_345"
          />
        </Elements>
      </StripeProvider>
    </div>
  ))
  .add('Progress (order)', () => <Progress step="Order" />)
  .add('Progress (delivery)', () => <Progress step="Delivery" />)
  .add('Progress (payment)', () => <Progress step="Payment" />)
  .add('Progress (confirmation)', () => <Progress step="Confirmation" />)
  .add('Input (valid)', () => (
    <Modal onClose={a('close modal')}>
      <div style={{ width: 300 }}>
        <Input
          valid={true}
          onChange={() => {}}
          placeholder="Credit Card #"
          invalidMsg="Invalid Credit Card Number"
        />
      </div>
    </Modal>
  ))
  .add('Input (invalid)', () => (
    <Modal onClose={a('close modal')}>
      <div style={{ width: 300 }}>
        <Input
          valid={false}
          onChange={() => {}}
          placeholder="Credit Card #"
          invalidMsg="Invalid Credit Card Number"
        />
      </div>
    </Modal>
  ))
  .add('Input (invalid+value)', () => (
    <Modal onClose={a('close modal')}>
      <div style={{ width: 300 }}>
        <Input
          valid={false}
          onChange={() => {}}
          placeholder="Credit Card #"
          value="444"
          invalidMsg="Invalid Credit Card Number"
        />
      </div>
    </Modal>
  ))
  .add('MessageThrobber', () => (
    <Modal onClose={a('close modal')}>
      <MessageThrobber msg="Calculating exact shipping cost" />
    </Modal>
  ))
  .add('CostExplanation', () => (
    <Modal onClose={a('close modal')}>
      <CostExplanation onGotIt={a('got it')} />
    </Modal>
  ))
  .add('Success', () => (
    <Modal onClose={a('close modal')}>
      <Success email="you@example.com" onClose={a('close')} />
    </Modal>
  ))
  .add('CollectEmail', () => (
    <Modal onClose={a('close modal')}>
      <CollectEmail stored="" onSubmit={a('submit email')} />
    </Modal>
  ))
  .add('CollectAddress', () => (
    <div style={{ margin: 25 }}>
      <CollectAddress onSubmit={a('submit address')} />
    </div>
  ))
  .add('ConfirmFees (no tax)', () => (
    <Modal onClose={a('close modal')}>
      <ConfirmFees
        taxes={0}
        subTotal={824}
        shipping={399}
        ccFeeOffset={42}
        onConfirm={a('confirm shipping')}
        onBackToCart={a('back to cart')}
      />
    </Modal>
  ))
  .add('ConfirmFees (with tax)', () => (
    <Modal onClose={a('close modal')}>
      <ConfirmFees
        taxes={132}
        subTotal={824}
        shipping={399}
        ccFeeOffset={42}
        onConfirm={a('confirm shipping')}
        onBackToCart={a('back to cart')}
      />
    </Modal>
  ));
