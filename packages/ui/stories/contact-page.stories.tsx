import React from 'react';
import { storiesOf } from '@storybook/react';
import ContactForm from '../src/pages/contact/Form';
import ContactFormBlock from '../src/pages/contact/FormBlock';

function delay(delay: number, result: boolean = true): () => Promise<boolean> {
  return () => {
    return new Promise(res => {
      setTimeout(() => res(result), delay);
    });
  };
}

storiesOf('Contact page', module)
  .add('ContactForm', () => <ContactForm onSubmit={async () => true} />)
  .add('ContactFormBlock (success)', () => <ContactFormBlock onSubmit={delay(4000)} />)
  .add('ContactFormBlock (error)', () => (
    <ContactFormBlock onSubmit={delay(4000, false)} />
  ));
