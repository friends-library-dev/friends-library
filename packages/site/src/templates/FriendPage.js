// @flow
import * as React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import type { Name, Description } from '../../../../type';
import { Layout, Block, Divider, PageTitle, Badge, DocumentTeaser } from '../components';
import { h2 } from '../typography';

type Props = {|
  data: {|
    friend: {|
      name: Name,
      description: Description,
      documents: Array<*>
    |},
  |}
|};

const DocsHeader = styled.h2`
  compose: ${h2};
  > span {
    margin-left: 6px;
  }
`

export default ({ data: { friend } }: Props) => (
  <Layout>
    <Block>
      <section>
        <PageTitle>{friend.name}</PageTitle>
        <p>
          {friend.description}
        </p>
      </section>
      <Divider />
      <section>
        <DocsHeader>
          Documents
          <Badge>
            {friend.documents.length}
          </Badge>
        </DocsHeader>
        {friend.documents.map(doc => (
          <DocumentTeaser
            key={doc.slug}
            title={doc.title}
            friendName={friend.name}
            hasAudio={doc.hasAudio}
            hasUpdatedEdition={doc.hasUpdatedEdition}
            shortestEditionPages={doc.shortestEdition.pages}
            tags={doc.tags}
            url={doc.url}
          />
        ))}
      </section>
    </Block>
  </Layout>
)

export const query = graphql`
  query GetFriend($slug: String!) {
    friend(slug: {eq: $slug}) {
      name
      description
      documents {
        slug
        title
        hasAudio
        hasUpdatedEdition
        tags
        url
        shortestEdition {
          pages
        }
      }
    }
  }
`;
