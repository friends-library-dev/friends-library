// @flow
import * as React from 'react';
import { graphql } from 'gatsby';
import { Layout, Block, PageTitle, Divider, ByLine, Edition } from '../components';

export default ({ data: { friend }, pageContext: { documentSlug } }: *) => {
  const document = friend.documents.find(d => d.slug === documentSlug);
  console.log({ document });
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


// @TODO we're getting ALL the documents here, but I can't
// figure out how to limit the return of the sub-object
// because my graphql skills are terrible right now ¯\_(ツ)_/¯
export const query = graphql`
  query GetFriendDoc($friendSlug: String!) {
    friend(slug: {eq: $friendSlug}) {
      name
      url
      documents {
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
  }
`
