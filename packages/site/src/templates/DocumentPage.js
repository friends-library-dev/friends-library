// @flow
import * as React from 'react';
import { graphql } from 'gatsby';
import { Layout, Block, PageTitle, Divider, ByLine, Edition } from '../components';

export default ({ data: { friend, document } }: *) => {
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
          {document.editions.map(e => <Edition key={e.type} edition={e} />)}
        </div>
      </Block>
    </Layout>
  );
};


export const query = graphql`
  query DocumentPage($documentSlug: String!, $friendSlug: String!) {
    friend(slug: {eq: $friendSlug}) {
      name
      url
    }
    document(slug: {eq: $documentSlug}, friendSlug: {eq: $friendSlug}) {
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
`
