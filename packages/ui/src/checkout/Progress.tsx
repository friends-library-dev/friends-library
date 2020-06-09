import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';

interface Props {
  step: 'Order' | 'Delivery' | 'Payment' | 'Confirmation';
}

const Progress: React.FC<Props> = ({ step }) => {
  return (
    <ol className="flex antialiased font-hairline tracking-wider justify-center font-sans text-center text-md md:text-lg">
      <Step step={t`Order`} active={step === `Order`} complete={true} />
      <Step step={t`Delivery`} active={step === `Delivery`} complete={step !== `Order`} />
      <Step
        step={t`Payment`}
        active={step === `Payment`}
        complete={[`Payment`, `Confirmation`].includes(step)}
      />
      <Step
        step={t`Confirmation`}
        active={step === `Confirmation`}
        complete={step === `Confirmation`}
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
    className={cx(`w-1/3 md:w-48 border-b-4 md:border-b-8 py-3 md:py-4`, {
      'border-gray-400': !complete,
      'border-flprimary': complete,
      'text-flprimary': complete,
      'text-gray-600': !complete,
      'hidden md:block': step === `Confirmation`,
      bracketed: active,
    })}
  >
    {step}
  </li>
);
