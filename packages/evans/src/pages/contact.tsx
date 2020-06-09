import React from 'react';
import { graphql } from 'gatsby';
import { FluidBgImageObject } from '@friends-library/types';
import { ContactFormBlock } from '@friends-library/ui';
import { t } from '@friends-library/locale';
import { PAGE_META_DESCS } from '../lib/seo';
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
    <Seo title={t`Contact Us`} description={PAGE_META_DESCS.contact[LANG]} />
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
    const { status } = await window.fetch(`/.netlify/functions/site/contact`, {
      method: `POST`,
      credentials: `omit`,
      body: JSON.stringify({ ...data, lang: LANG }),
      headers: {
        'Content-Type': `application/json`,
        Accept: `application/json`,
      },
    });
    return status === 204;
  } catch {
    return false;
  }
}
