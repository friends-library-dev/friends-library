import React from 'react';
import { graphql } from 'gatsby';
import {
  FormatType,
  EditionType,
  Url,
  Title,
  Name,
  Slug,
  Description,
} from '@friends-library/types';
import { Layout, Block, PageTitle, Divider, ByLine, Edition } from '../components';

interface Props {
  data: {
    friend: {
      name: Name;
      url: Url;
    };
    document: {
      slug: Slug;
      title: Title;
      description: Description;
      isCompilation: boolean;
      editions: {
        type: EditionType;
        description: Description;
        formats: {
          type: FormatType;
          url: Url;
        }[];
      }[];
    };
  };
}

export default ({ data: { friend, document } }: Props) => {
  return (
    <Layout>
      <Block>
        <div>
          <PageTitle>{document.title}</PageTitle>
          <ByLine
            isCompilation={document.isCompilation}
            friendUrl={friend.url}
            friendName={friend.name}
          />
          <p>{document.description}</p>
        </div>
        <Divider />
        <div>
          {document.editions.map(e => (
            <Edition key={e.type} edition={e} />
          ))}
        </div>
      </Block>
    </Layout>
  );
};

export const query = graphql`
  query DocumentPage($documentSlug: String!, $friendSlug: String!) {
    friend(slug: { eq: $friendSlug }) {
      name
      url
    }
    document(slug: { eq: $documentSlug }, friendSlug: { eq: $friendSlug }) {
      editions {
        type
        description
        formats {
          type
          url
        }
      }
      isCompilation
      description
      slug
      title
    }
  }
`;
