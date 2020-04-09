import React from 'react';
import { graphql } from 'gatsby';
import { FluidBgImageObject } from '@friends-library/types';
import { ContactFormBlock, t } from '@friends-library/ui';
import { Layout, Seo } from '../components';
import { LANG } from '../env';

interface Props {
  data: {
    books: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
  };
}

const ContactPage: React.FC<Props> = ({ data }) => (
  <Layout>
    <Seo
      title={t`Contact Us`}
      description={[
        'Got a question? — or are you having any sort of technical trouble with our books or website? Want to reach out for any other reason? We’d love to hear from you! You can expect to hear back within a day or two.',
        '¿Tienes alguna pregunta? — ¿o estás teniendo algún tipo de problema técnico con nuestros libros o con el sitio? ¿Quieres ponerte en contacto por alguna otra razón? ¡Nos encantaría escucharte! Puedes contar con nuestra respuesta en un día o dos.',
      ]}
    />
    <ContactFormBlock bgImg={data.books.image.fluid} onSubmit={submit} />
  </Layout>
);

export default ContactPage;

export const query = graphql`
  query ContactFormBg {
    books: file(relativePath: { eq: "Books7.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;

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
