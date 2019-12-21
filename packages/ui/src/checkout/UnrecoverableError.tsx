import React from 'react';
import Link from 'gatsby-link';
import Header from './Header';
import Button from '../Button';
import ErrorMsg from './ErrorMsg';

interface Props {
  onRetry: () => void;
  onClose: () => void;
}

const UnrecoverableError: React.FC<Props> = ({ onRetry, onClose }) => (
  <div>
    <Header>Error</Header>
    <ErrorMsg>
      <span role="img" aria-label="">
        😬
      </span>{' '}
      Whoops! We're very sorry &mdash; the checkout process encountered a rare and
      unexpected error. Don't worry, your credit card <i>was not charged.</i> Please try
      your order again in a few moments. Our team has already been notified of the error.
      If the problem persists, please{' '}
      <Link to="/contact-us" className="underline">
        contact us
      </Link>{' '}
      to get help completing your order.
    </ErrorMsg>
    <div className="flex flex-col items-center mt-8 md:flex-row md:justify-center">
      <Button className="bg-flprimary mb-6 md:mb-0 md:mr-6" onClick={onRetry}>
        Try again
      </Button>
      <Button className="bg-gray-500" onClick={onClose}>
        Close
      </Button>
    </div>
  </div>
);

export default UnrecoverableError;
