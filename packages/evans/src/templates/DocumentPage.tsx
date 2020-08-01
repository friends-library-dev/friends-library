import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import { t } from '@friends-library/locale';
import {
  EditionType,
  CoverProps,
  PrintSize,
  Heading,
  Lang,
} from '@friends-library/types';
import {
  DocBlock,
  ListenBlock,
  BookTeaserCards,
  makeScroller,
} from '@friends-library/ui';
import { Layout, Seo } from '../components';
import ExploreBooksBlock from '../components/ExploreBooksBlock';
import { SiteMetadata } from '../types';
import { LANG } from '../env';
import { bookPageMetaDesc } from '../lib/seo';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';

interface Props {
  data: {
    site: SiteMetadata;
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
      htmlTitle: string;
      htmlShortTitle: string;
      description: string;
      altLanguageUrl: string | null;
      isCompilation: boolean;
      isComplete: boolean;
      editions: {
        type: EditionType;
        isbn: string;
        price: number;
        downloadUrl: {
          web_pdf: string;
          mobi: string;
          epub: string;
        };
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
          complete: boolean;
          externalPlaylistIdLq: null | number;
          externalPlaylistIdHq: null | number;
          m4bFilesizeHq: string;
          m4bFilesizeLq: string;
          mp3ZipFilesizeHq: string;
          mp3ZipFilesizeLq: string;
          m4bUrlLq: string;
          mp3ZipUrlLq: string;
          podcastUrlLq: string;
          m4bUrlHq: string;
          mp3ZipUrlHq: string;
          podcastUrlHq: string;
          parts: { externalIdLq: number; externalIdHq: number }[];
        };
      }[];
    };
    otherDocuments: {
      nodes: (CoverData & {
        id: string;
        description: string;
        htmlShortTitle: string;
        documentUrl: string;
        authorUrl: string;
      })[];
    };
  };
}

const DocumentPage: React.FC<Props> = ({
  data: { site, friend, document, otherDocuments },
}) => {
  useEffect(() => {
    if (window.location.hash === `#audiobook`) {
      setTimeout(makeScroller(`#audiobook`), 10);
    }
  }, []);
  const numBooks = site.meta[LANG === `en` ? `numEnglishBooks` : `numSpanishBooks`];
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
    customCss: mainEdition.code.css.cover || ``,
    customHtml: mainEdition.code.html.cover || ``,
  };
  return (
    <Layout>
      <Seo
        title={document.title}
        description={bookPageMetaDesc(
          friend.name,
          document.description,
          document.htmlShortTitle,
          hasAudio,
          document.isCompilation,
          LANG,
        )}
      />
      <DocBlock
        description={document.description}
        htmlTitle={document.htmlTitle}
        htmlShortTitle={document.htmlShortTitle}
        authorUrl={friend.url}
        price={mainEdition.price}
        hasAudio={hasAudio}
        documentId={document.id}
        numChapters={mainEdition.numChapters}
        altLanguageUrl={document.altLanguageUrl}
        isComplete={document.isComplete}
        {...coverProps}
        pages={mainEdition.pages}
        editions={document.editions.map((edition) => ({
          title: document.title,
          type: edition.type,
          printSize: edition.printSize,
          numPages: edition.pages,
          downloadUrl: edition.downloadUrl,
        }))}
      />
      {audio && (
        <ListenBlock
          title={document.title}
          complete={audio.complete}
          numAudioParts={audio.parts.length}
          trackIdHq={audio.parts[0].externalIdHq || 0}
          playlistIdHq={audio.externalPlaylistIdHq}
          trackIdLq={audio.parts[0].externalIdLq || 0}
          playlistIdLq={audio.externalPlaylistIdLq}
          m4bFilesizeHq={audio.m4bFilesizeHq}
          m4bFilesizeLq={audio.m4bFilesizeLq}
          mp3ZipFilesizeHq={audio.mp3ZipFilesizeHq}
          mp3ZipFilesizeLq={audio.mp3ZipFilesizeLq}
          m4bUrlHq={audio.m4bUrlHq}
          m4bUrlLq={audio.m4bUrlLq}
          mp3ZipUrlHq={audio.mp3ZipUrlHq}
          mp3ZipUrlLq={audio.mp3ZipUrlLq}
          podcastUrlHq={audio.podcastUrlHq}
          podcastUrlLq={audio.podcastUrlLq}
        />
      )}
      <BookTeaserCards
        title={
          document.isCompilation ? t`Other Compilations` : t`Other Books by this Author`
        }
        titleEl="h2"
        bgColor="flgray-100"
        titleTextColor="flblack"
        books={otherBooks.map((book) => ({
          ...book,
          ...coverPropsFromQueryData(book),
        }))}
      />
      {(!audio || otherBooks.length === 0) && (
        <ExploreBooksBlock numTotalBooks={numBooks} />
      )}
    </Layout>
  );
};

export default DocumentPage;

export const query = graphql`
  query DocumentPage($documentSlug: String!, $friendSlug: String!) {
    site {
      ...SiteMetadata
    }
    friend(slug: { eq: $friendSlug }) {
      id: friendId
      lang
      slug
      name
      url
    }
    document(slug: { eq: $documentSlug }, friendSlug: { eq: $friendSlug }) {
      htmlTitle
      htmlShortTitle
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
          complete
          externalPlaylistIdLq
          externalPlaylistIdHq
          m4bFilesizeHq
          m4bFilesizeLq
          mp3ZipFilesizeHq
          mp3ZipFilesizeLq
          m4bUrlLq
          mp3ZipUrlLq
          podcastUrlLq
          m4bUrlHq
          mp3ZipUrlHq
          podcastUrlHq
          parts {
            externalIdLq
            externalIdHq
          }
        }
      }
      altLanguageUrl
      isCompilation
      isComplete
      description
      slug
      title
      id: documentId
    }
    otherDocuments: allDocument(
      filter: { friendSlug: { eq: $friendSlug }, slug: { ne: $documentSlug } }
    ) {
      nodes {
        ...CoverProps
        id: documentId
        documentUrl: url
        htmlShortTitle
        description: partialDescription
        authorUrl
      }
    }
  }
`;
