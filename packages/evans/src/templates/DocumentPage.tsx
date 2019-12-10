import React from 'react';
import { graphql } from 'gatsby';
import {
  EditionType,
  CoverProps,
  PrintSize,
  Heading,
  Lang,
} from '@friends-library/types';
import { Layout } from '../components';
import {
  DocBlock,
  ListenBlock,
  ReadSampleBlock,
  RelatedBookCard,
} from '@friends-library/ui';

interface Props {
  data: {
    friend: {
      lang: Lang;
      name: string;
      slug: string;
      url: string;
    };
    document: {
      id: string;
      slug: string;
      title: string;
      description: string;
      altLanguageUrl: string | null;
      isCompilation: boolean;
      editions: {
        type: EditionType;
        isbn: string;
        price: number;
        chapterHeadings: Heading[];
        customCode: {
          css: { paperback_cover: null | string };
          html: { paperback_cover: null | string };
        };
        numChapters: number;
        description: string | null;
        printSize: PrintSize;
        pages: number[];
        audio: null | { reader: string };
      }[];
    };
    otherDocuments: {
      nodes: {
        title: string;
        slug: string;
        description: string;
        isCompilation: boolean;
        editions: {
          customCode: {
            css: { paperback_cover: null | string };
            html: { paperback_cover: null | string };
          };
          isbn: string;
          type: EditionType;
        }[];
      }[];
    };
  };
}

export default ({ data: { friend, document, otherDocuments } }: Props) => {
  const otherBooks = otherDocuments.nodes;
  const mainEdition = document.editions[0];
  const hasAudio = !!mainEdition.audio;
  const coverProps: CoverProps = {
    lang: process.env.GATSBY_LANG === 'en' ? 'en' : 'es',
    title: document.title,
    isCompilation: document.isCompilation,
    author: friend.name,
    size: mainEdition.printSize,
    pages: mainEdition.pages[0],
    edition: mainEdition.type,
    isbn: mainEdition.isbn,
    blurb: document.description,
    customCss: mainEdition.customCode.css.paperback_cover || '',
    customHtml: mainEdition.customCode.html.paperback_cover || '',
  };
  return (
    <Layout>
      <DocBlock
        description={document.description}
        isbn={mainEdition.isbn}
        customHtml=""
        authorUrl={friend.url}
        price={mainEdition.price}
        hasAudio={hasAudio}
        numChapters={mainEdition.numChapters}
        altLanguageUrl={document.altLanguageUrl}
        {...coverProps}
        pages={mainEdition.pages}
      />
      <ReadSampleBlock
        price={mainEdition.price}
        hasAudio={hasAudio}
        chapters={mainEdition.chapterHeadings}
      />
      <ListenBlock />
      {otherBooks.length > 0 && (
        <div className="p-8 pt-12" style={{ backgroundColor: 'rgb(249, 249, 249)' }}>
          <h1 className="font-sans font-bold text-2xl text-center mb-8 tracking-wider">
            Other Books by this Author
          </h1>
          <div className="xl:flex justify-center">
            {otherBooks.map(book => (
              <RelatedBookCard
                lang={friend.lang}
                isbn={book.editions[0].isbn}
                title={book.title}
                isCompilation={book.isCompilation}
                author={friend.name}
                edition={book.editions[0].type}
                description={(book.description || '')
                  .split(' ')
                  .slice(0, 30)
                  .concat(['...'])
                  .join(' ')}
                customCss={book.editions[0].customCode.css.paperback_cover || ''}
                customHtml={book.editions[0].customCode.html.paperback_cover || ''}
                authorSlug={friend.slug}
                documentSlug={book.slug}
              />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export const query = graphql`
  query DocumentPage($documentSlug: String!, $friendSlug: String!) {
    friend(slug: { eq: $friendSlug }) {
      id
      lang
      slug
      name
      url
    }
    document(slug: { eq: $documentSlug }, friendSlug: { eq: $friendSlug }) {
      editions: childrenEdition {
        type
        isbn
        description
        printSize
        pages
        price
        ...CoverCode
        chapterHeadings {
          id
          text
          shortText
          sequence {
            type
            number
          }
        }
        numChapters
        audio {
          reader
        }
      }
      altLanguageUrl
      isCompilation
      description
      slug
      title
      id
    }
    otherDocuments: allDocument(
      filter: { friendSlug: { eq: $friendSlug }, slug: { ne: $documentSlug } }
    ) {
      nodes {
        title
        slug
        description
        isCompilation
        editions: childrenEdition {
          isbn
          type
          ...CoverCode
        }
      }
    }
  }
`;
