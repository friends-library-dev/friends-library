import React from 'react';
import { graphql, Link } from 'gatsby';
import { Url, Title, Name } from '@friends-library/types';
import { Layout, Block, PageTitle, Divider } from '../components';

interface Props {
  data: {
    allAudio: {
      edges: {
        node: {
          url: Url;
          documentTitle: Title;
          friendName: Name;
        };
      }[];
    };
  };
}

export default ({
  data: {
    allAudio: { edges },
  },
}: Props) => (
  <Layout>
    <Block>
      <PageTitle>Audiobooks</PageTitle>
      <p>
        <i>
          [The idea behind this page is a one-stop location to find every book that we
          currently have audio for. It's possible (likely?) that as we expand the amount
          of audiobooks more and more, the utility of this page will diminish, and we
          might at some point no longer need it.]
        </i>
      </p>
      <p>
        Below is a list of every book for which we currently have a completed audiobook
        edition. Check back often as we're frequently adding new recordings!
      </p>
      <Divider />
      <ul>
        {edges.map(({ node: { url, documentTitle, friendName } }) => (
          <li key={url}>
            <Link to={url}>
              {friendName}: {documentTitle}
            </Link>
          </li>
        ))}
      </ul>
    </Block>
  </Layout>
);

export const query = graphql`
  {
    allAudio {
      edges {
        node {
          url
          documentTitle
          friendName
        }
      }
    }
  }
`;
