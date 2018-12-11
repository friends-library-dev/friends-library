// @flow
import * as React from 'react';
import { graphql } from 'gatsby';
import type { FormatType, EditionType, Url, Title, Name, Slug, Description } from '../../../../type';
import { Layout, Block, PageTitle, Divider, ByLine, Edition } from '../components';

type Props = {|
  data: {|
    friend: {|
      name: Name,
      url: Url,
    |},
    document: {|
      slug: Slug,
      title: Title,
      description: Description,
      isCompilation: boolean,
      editions: Array<{|
        type: EditionType,
        description: Description,
        formats: Array<{|
          type: FormatType,
          url: Url,
        |}>
      |}>
    |}
  |},
|};

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
`;
