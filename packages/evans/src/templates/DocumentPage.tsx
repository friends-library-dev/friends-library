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
import { LANG } from '../env';
import {
  DocBlock,
  ListenBlock,
  RelatedBookCard,
  ExploreBooksBlock,
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
        downloadUrl: {
          web_pdf: string;
          mobi: string;
          epub: string;
        };
        cartItemTitles: string[];
        cartItemCoverPdfUrls: string[];
        cartItemInteriorPdfUrls: string[];
        chapterHeadings: Heading[];
        code: {
          css: { cover: null | string };
          html: { cover: null | string };
        };
        numChapters: number;
        description: string | null;
        printSize: PrintSize;
        pages: number[];
        audio: null | {
          reader: string;
          externalPlaylistIdLq: null | number;
          m4bUrlLq: string;
          mp3ZipUrlLq: string;
          podcastUrlLq: string;
          m4bUrlHq: string;
          mp3ZipUrlHq: string;
          podcastUrlHq: string;
          parts: { externalIdLq: number }[];
        };
      }[];
    };
    otherDocuments: {
      nodes: {
        title: string;
        url: string;
        description: string;
        isCompilation: boolean;
        editions: {
          code: {
            css: { cover: null | string };
            html: { cover: null | string };
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
  const audio = mainEdition.audio;
  const hasAudio = !!audio;
  const coverProps: CoverProps = {
    lang: LANG,
    title: document.title,
    isCompilation: document.isCompilation,
    author: friend.name,
    size: mainEdition.printSize,
    pages: mainEdition.pages[0],
    edition: mainEdition.type,
    isbn: mainEdition.isbn,
    blurb: document.description,
    customCss: mainEdition.code.css.cover || '',
    customHtml: mainEdition.code.html.cover || '',
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
        author={friend.name}
        documentId={document.id}
        numChapters={mainEdition.numChapters}
        altLanguageUrl={document.altLanguageUrl}
        {...coverProps}
        pages={mainEdition.pages}
        editions={document.editions.map(edition => ({
          title: edition.cartItemTitles,
          interiorPdfUrl: edition.cartItemInteriorPdfUrls,
          coverPdfUrl: edition.cartItemCoverPdfUrls,
          type: edition.type,
          printSize: edition.printSize,
          numPages: edition.pages,
          downloadUrl: edition.downloadUrl,
        }))}
      />
      {audio && (
        <ListenBlock
          title={document.title}
          numAudioParts={audio.parts.length}
          trackId={audio.parts[0].externalIdLq || 0}
          playlistId={audio.externalPlaylistIdLq}
          m4bUrlHq={audio.m4bUrlHq}
          mp3ZipUrlHq={audio.mp3ZipUrlHq}
          podcastUrlHq={audio.podcastUrlHq}
          m4bUrlLq={audio.m4bUrlLq}
          mp3ZipUrlLq={audio.mp3ZipUrlLq}
          podcastUrlLq={audio.podcastUrlLq}
        />
      )}
      {otherBooks.length > 0 && (
        <div className="p-8 pt-12 bg-flgray-100">
          <h1 className="font-sans font-bold text-2xl text-center mb-8 tracking-wider">
            Other Books by this Author
          </h1>
          <div className="xl:flex justify-center">
            {otherBooks.map(book => (
              <RelatedBookCard
                key={book.url}
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
                customCss={book.editions[0].code.css.cover || ''}
                customHtml={book.editions[0].code.html.cover || ''}
                authorUrl={friend.url}
                documentUrl={book.url}
              />
            ))}
          </div>
        </div>
      )}
      {(!audio || otherBooks.length === 0) && <ExploreBooksBlock />}
    </Layout>
  );
};

export const query = graphql`
  query DocumentPage($documentSlug: String!, $friendSlug: String!) {
    friend(slug: { eq: $friendSlug }) {
      id: friendId
      lang
      slug
      name
      url
    }
    document(slug: { eq: $documentSlug }, friendSlug: { eq: $friendSlug }) {
      editions {
        type
        isbn
        description
        printSize
        pages
        price
        downloadUrl {
          web_pdf
          mobi
          epub
        }
        cartItemTitles
        cartItemCoverPdfUrls
        cartItemInteriorPdfUrls
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
          externalPlaylistIdLq
          m4bUrlLq
          mp3ZipUrlLq
          podcastUrlLq
          m4bUrlHq
          mp3ZipUrlHq
          podcastUrlHq
          parts {
            externalIdLq
          }
        }
      }
      altLanguageUrl
      isCompilation
      description
      slug
      title
      id: documentId
    }
    otherDocuments: allDocument(
      filter: { friendSlug: { eq: $friendSlug }, slug: { ne: $documentSlug } }
    ) {
      nodes {
        title
        url
        description
        isCompilation
        editions {
          isbn
          type
          ...CoverCode
        }
      }
    }
  }
`;
