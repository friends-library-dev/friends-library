import React from 'react';
import { ContactFormBlock } from '@friends-library/ui';
import { Layout } from '../components';
import { LANG } from '../env';

const ContactPage: React.FC = () => (
  <Layout>
    <ContactFormBlock onSubmit={submit} />
  </Layout>
);

export default ContactPage;

async function submit(data: Record<string, string>): Promise<boolean> {
  try {
    const { status } = await window.fetch('/.netlify/functions/site/contact', {
      method: 'POST',
      credentials: 'omit',
      body: JSON.stringify({ ...data, lang: LANG }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return status === 204;
  } catch {
    return false;
  }
}
