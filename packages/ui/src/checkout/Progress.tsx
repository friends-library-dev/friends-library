import React from 'react';
import cx from 'classnames';

interface Props {
  step: 'Order' | 'Delivery' | 'Payment' | 'Confirmation';
}

const Progress: React.FC<Props> = ({ step }) => {
  return (
    <ol className="flex antialiased font-hairline tracking-wider justify-center font-sans text-center text-md md:text-lg">
      <Step step="Order" active={step === 'Order'} complete={true} />
      <Step step="Delivery" active={step === 'Delivery'} complete={step !== 'Order'} />
      <Step
        step="Payment"
        active={step === 'Payment'}
        complete={['Payment', 'Order'].includes(step)}
      />
      <Step
        step="Confirmation"
        active={step === 'Confirmation'}
        complete={step === 'Confirmation'}
      />
    </ol>
  );
};

export default Progress;

const Step: React.FC<{ active: boolean; complete: boolean; step: string }> = ({
  active,
  complete,
  step,
}) => (
  <li
    className={cx('w-1/3 md:w-48 border-b-4 md:border-b-8 py-3 md:py-4', {
      'border-gray-400': !complete,
      'border-flprimary': complete,
      'text-flprimary': complete,
      'text-gray-600': !complete,
      'hidden md:block': step === 'Confirmation',
    })}
  >
    {`${active ? `[ ${step} ]` : step}`}
  </li>
);
