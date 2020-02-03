import React from 'react';
import { graphql, Link } from 'gatsby';
import { Url, Title, Name } from '@friends-library/types';
import { Layout } from '../components';

interface Props {
  data: {
    allFriend: {
      nodes: {
        name: Name;
        documents: {
          url: Url;
          title: Title;
          hasAudio: boolean;
        }[];
      }[];
    };
  };
}

export default ({
  data: {
    allFriend: { nodes: friends },
  },
}: Props) => (
  <Layout>
    <section>
      <h1>Audiobooks</h1>
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
      <ul>
        {friends
          .flatMap(f => f.documents.map(doc => ({ ...doc, friendName: f.name })))
          .filter(d => d.hasAudio)
          .map(doc => (
            <li key={doc.url}>
              <Link to={doc.url}>
                {doc.friendName}: {doc.title}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  </Layout>
);

export const query = graphql`
  {
    allFriend(filter: { childrenDocument: { elemMatch: { hasAudio: { eq: true } } } }) {
      nodes {
        name
        documents: childrenDocument {
          url
          title
          hasAudio
        }
      }
    }
  }
`;
