import React from 'react';
import { storiesOf } from '@storybook/react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { action as a } from '@storybook/addon-actions';
import Modal from '../src/checkout/Modal';
import MessageThrobber from '../src/checkout/MessageThrobber';
import CostExplanation from '../src/checkout/CostExplanation';
import CollectEmail from '../src/checkout/CollectEmail';
import CollectAddress from '../src/checkout/CollectAddress';
import Payment from '../src/checkout/Payment';
import Input from '../src/checkout/Input';
import Progress from '../src/checkout/Progress';
import Success from '../src/checkout/Success';
import ConfirmFees from '../src/checkout/ConfirmFees';

storiesOf('Checkout Components', module)
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
            paymentIntentClientSecret="pi_1FrU2XEswFkMHmtgmm48hicB_secret_wfDDG8R6qaQSoooevUltSZQDG"
          />
        </Elements>
      </StripeProvider>
    </div>
  ))
  .add('Progress (order)', () => <Progress step="Order" />)
  .add('Progress (payment)', () => <Progress step="Payment" />)
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
  // .add('CollectCreditCard', () => (
  //   <Modal onClose={a('close modal')}>
  //     <CollectCreditCard />
  //   </Modal>
  // ))
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
