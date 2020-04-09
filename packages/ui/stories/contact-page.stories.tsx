import React from 'react';
import { storiesOf } from '@storybook/react';
import ContactForm from '../src/pages/contact/Form';
import ContactFormBlock from '../src/pages/contact/FormBlock';

// @ts-ignore
import Books from '../src/images/Books7.jpg';

function delay(delay: number, result: boolean = true): () => Promise<boolean> {
  return () => {
    return new Promise(res => {
      setTimeout(() => res(result), delay);
    });
  };
}

const books = { aspectRatio: 1, src: Books, srcSet: '' };

storiesOf('Contact page', module)
  .add('ContactForm', () => <ContactForm onSubmit={async () => true} />)
  .add('ContactFormBlock (success)', () => (
    <ContactFormBlock bgImg={books} onSubmit={delay(4000)} />
  ))
  .add('ContactFormBlock (error)', () => (
    <ContactFormBlock bgImg={books} onSubmit={delay(4000, false)} />
  ));
