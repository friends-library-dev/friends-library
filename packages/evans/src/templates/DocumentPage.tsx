import React from 'react';
import { graphql } from 'gatsby';
import {
  FormatType,
  EditionType,
  Url,
  Title,
  Name,
  Slug,
  Uuid,
  Description,
  CoverProps,
} from '@friends-library/types';
import { ThreeD as Cover3D, css as coverCss } from '@friends-library/cover-component';
import { Layout, Block, PageTitle, Divider, ByLine, Edition } from '../components';

interface Props {
  data: {
    friend: {
      name: Name;
      url: Url;
    };
    document: {
      id: Uuid;
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
  const coverProps: CoverProps = {
    lang: process.env.GATSBY_LANG === 'en' ? 'en' : 'es',
    title: document.title,
    author: friend.name,
    size: 'm', // @TODO
    pages: 222, // @TODO
    edition: document.editions[0].type,
    blurb: document.description,
    showGuides: false,
    customCss: '',
    customHtml: '',
  };
  return (
    <Layout>
      <Block>
        <div>
          <Cover3D {...coverProps} />
          <PageTitle>{document.title}</PageTitle>
          <ByLine
            isCompilation={document.isCompilation}
            friendUrl={friend.url}
            friendName={friend.name}
          />
          <p>{document.description}</p>
          <style>
            {`.Cover { float: left; }`}
            {coverCss.common(coverProps)[1]}
            {coverCss.front(coverProps)[1]}
            {coverCss.back(coverProps)[1]}
            {coverCss.spine(coverProps)[1]}
            {coverCss.threeD(coverProps)[1]}
          </style>
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
      id
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
      id
    }
  }
`;
