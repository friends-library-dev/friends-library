import React, { useState } from 'react';
import cx from 'classnames';
import Button from '../../Button';
import { makeScroller } from '../../lib/scroll';
import './Form.css';

interface Props {
  className?: string;
  onSubmit: (formData: Record<string, string>) => Promise<boolean>;
}

const ContactForm: React.FC<Props> = ({ className, onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [subject, setSubject] = useState<'tech' | 'other'>('tech');
  const [success, setSuccess] = useState<boolean>(false);
  const [state, setState] = useState<'default' | 'submitting' | 'submitted'>('default');
  return (
    <div className={cx(className, 'ContactForm bg-cover lg:bg-white')}>
      <form
        onSubmit={async event => {
          event.preventDefault();
          setSuccess(false);
          setState('submitting');
          const success = await onSubmit({ name, email, message, subject });
          setSuccess(success);
          if (success) {
            setMessage('');
          }
          setState('submitted');
          setTimeout(() => makeScroller('.FormResultMsg', 20)(), 10);
        }}
        className="bg-white p-8 sm:p-10"
      >
        {state === 'submitted' && success && (
          <p className="FormResultMsg bg-green-700 text-white py-4 px-6 mb-6">
            Success! You should hear back from us shortly.
          </p>
        )}
        {state === 'submitted' && !success && (
          <p className="FormResultMsg bg-red-800 text-white py-4 px-6 mb-6">
            Sorry! There was a problem sending your request. Please try again, or{' '}
            <a
              href={`mailto:${fallbackEmail}?body=${encodeURIComponent(message)}`}
              className="border-b border-white border-dotted"
            >
              email us directly
            </a>{' '}
            if the problem persists.
          </p>
        )}
        <fieldset>
          <Label htmlFor="name">Name</Label>
          <input
            value={name}
            required
            onChange={e => setName(e.target.value)}
            className={inputClasses()}
            autoFocus
            type="text"
            id="name"
            name="name"
            autoComplete="name"
          />
        </fieldset>
        <fieldset>
          <Label htmlFor="email">Email</Label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClasses()}
            type="email"
            name="email"
            autoComplete="email"
            required
            id="email"
          />
        </fieldset>
        <div className="body-text flex flex-col md:flex-row mb-4 mt-2 md:mb-8 md:pt-2">
          <label htmlFor="subject-tech" className="cursor-pointer md:mr-10">
            <input
              type="radio"
              checked={subject === 'tech'}
              id="subject-tech"
              className="sr-only"
              onChange={() => setSubject('tech')}
            />
            <span>Website / technical questions</span>
          </label>
          <label htmlFor="subject-other" className="cursor-pointer">
            <input
              type="radio"
              checked={subject === 'other'}
              onChange={() => setSubject('other')}
              id="subject-other"
              className="sr-only"
            />
            <span>All other subjects</span>
          </label>
        </div>
        <fieldset>
          <Label htmlFor="message">Message</Label>
          <textarea
            required
            value={message}
            onChange={event => setMessage(event.target.value)}
            className={inputClasses()}
            name="message"
            id="message"
          ></textarea>
        </fieldset>
        <Button className="my-2" width="100%" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;

const Label: React.FC<{ htmlFor: string }> = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="sans-wide text-flgray-500 text-xl antialiased mb-2 md:mb-4 inline-block"
  >
    {children}
  </label>
);

function inputClasses(): string {
  return 'border border-gray-500 py-2 px-4 mb-6 block w-full body-text subtle-focus';
}

const fallbackEmail = 'jared+friends-library-contact@netrivet.com';
