// @flow
import * as React from 'react';
import type { EditionType, Url, Title, Name } from '../../../../type';
import { graphql, Link } from 'gatsby';
import { Layout, Divider, PageTitle, ByLine, Block, EmbeddedAudio } from '../components';

type Props = {|
  pageContext: {|
    editionType: EditionType,
  |},
  data: {|
    friend: {|
      name: Name,
      url: Url,
    |},
    document: {|
      url: Url,
      isCompilation: boolean,
      title: Title,
      editions: Array<{|
        type: EditionType,
        audio: {|
          reader: Name,
          parts: Array<{|
            title: Title,
            externalIdHq: number,
          |}>
        |}
      |}>
    |}
  |}
|};


export default (
  { data: { document, friend }, pageContext: { editionType } }: Props
) => {
  const edition = document.editions.find(e => e.type === editionType);
  if (!edition) {
    throw new Error(`Edition of type ${editionType} not found`);
  }

  return (
    <Layout>
      <Block>
        <div>
          <PageTitle>{document.title} (audio)</PageTitle>
          <ByLine
            friendUrl={friend.url}
            friendName={friend.name}
            isCompilation={document.isCompilation}
          />
          <p>
          This is the audiobook version of {document.isCompilation ? '' : `${friend.name}'s:`} <Link to={document.url}>{document.title}</Link>, read by {edition.audio.reader}. For other formats besides audio, <Link to={document.url}>click here</Link>.
          </p>
          <p>
            <a href={`${document.url}/${editionType}/podcast.rss`}>
              Download as podcast.
            </a>
          </p>
        </div>
        <Divider />
        {edition.audio.parts.map(part => (
          <div key={part.externalIdHq}>
            <h3>{part.title}</h3>
            <EmbeddedAudio id={part.externalIdHq} title={part.title} />
          </div>
        ))}
      </Block>
    </Layout>
  );
}


export const query = graphql`
  query AudioPage($documentSlug: String!, $friendSlug: String!) {
    friend(slug: {eq: $friendSlug}) {
      name
      url
    }
    document(slug: {eq: $documentSlug}, friendSlug: {eq: $friendSlug}) {
      url
      isCompilation
      title
      editions {
        type
        audio {
          reader
          parts {
            title
            externalIdHq
          }
        }
      }
    }
  }
`
