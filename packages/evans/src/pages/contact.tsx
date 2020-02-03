import React from 'react';
import { graphql } from 'gatsby';
import { Html } from '@friends-library/types';
import { Layout } from '../components';

interface Props {
  data: {
    partial: {
      html: Html;
    };
  };
}

export default ({
  data: {
    partial: { html },
  },
}: Props) => (
  <Layout>
    <section>
      <h1>Contact Us</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  </Layout>
);

export const query = graphql`
  query {
    partial(id: { eq: "partial:contact-page" }) {
      html
    }
  }
`;
