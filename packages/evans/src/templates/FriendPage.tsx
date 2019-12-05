import React from 'react';
import { graphql } from 'gatsby';
import { styled } from '@friends-library/ui';
import { Name, Description } from '@friends-library/types';
import { Layout, Block, Divider, PageTitle, Badge, DocumentTeaser } from '../components';
import { h2 } from '../typography';

interface Props {
  data: {
    friend: {
      name: Name;
      description: Description;
      documents: any[];
    };
  };
}

const DocsHeader = styled.h2`
  compose: ${h2};
  > span {
    margin-left: 6px;
  }
`;

export default ({ data: { friend } }: Props) => (
  <Layout>
    <Block>
      <section>
        <PageTitle>{friend.name}</PageTitle>
        <p>{friend.description}</p>
      </section>
      <Divider />
      <section>
        <DocsHeader>
          Documents
          <Badge>{friend.documents.length}</Badge>
        </DocsHeader>
        {friend.documents.map(doc => (
          <DocumentTeaser
            key={doc.slug}
            title={doc.title}
            friendName={friend.name}
            hasAudio={doc.hasAudio}
            hasUpdatedEdition={doc.hasUpdatedEdition}
            tags={doc.tags}
            url={doc.url}
          />
        ))}
      </section>
    </Block>
  </Layout>
);

export const query = graphql`
  query GetFriend($slug: String!) {
    friend(slug: { eq: $slug }) {
      name
      description
      documents: childrenDocument {
        slug
        title
        hasAudio
        hasUpdatedEdition
        tags
        url
      }
    }
  }
`;
