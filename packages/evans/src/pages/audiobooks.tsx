import React from 'react';
import { graphql } from 'gatsby';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { Stack, Audiobook, AudiobooksHero, BookTeaserCard } from '@friends-library/ui';
import { Layout } from '../components';

interface Props {
  data: {
    audioBooks: {
      nodes: (CoverData & {
        authorUrl: string;
        documentUrl: string;
        description: string;
      })[];
    };
  };
}

const AudiobooksPage: React.FC<Props> = ({ data: { audioBooks } }: Props) => (
  <Layout>
    <AudiobooksHero className="p-16 pb-48 md:pb-56" numBooks={audioBooks.nodes.length} />
    <div className="bg-flgray-200 py-12 xl:pb-6">
      <h2 className="sans-wider text-center text-2xl md:text-3xl mb-12">
        Recently Added Audio Books
      </h2>
      <Stack
        space="16"
        xl="0"
        className="md:px-6 lg:px-24 xl:px-0 xl:flex flex-wrap justify-center"
      >
        {audioBooks.nodes.slice(0, 4).map(recent => (
          <BookTeaserCard
            className="xl:w-2/5 xl:mx-8 xl:mb-12"
            {...coverPropsFromQueryData(recent)}
            audioDuration="45:00"
            badgeText="Nov 22"
            authorUrl={recent.authorUrl}
            documentUrl={recent.documentUrl}
            description={
              recent.description ||
              'shoLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequ'
            }
          />
        ))}
      </Stack>
    </div>
    {audioBooks.nodes.map(book => (
      <Audiobook
        {...coverPropsFromQueryData(book)}
        bgColor="blue"
        duration="45:00"
        authorUrl={book.authorUrl}
        documentUrl={book.documentUrl}
        description={
          book.description ||
          'shoLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequ'
        }
      />
    ))}
  </Layout>
);

export default AudiobooksPage;

export const query = graphql`
  {
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        authorUrl
        description: partialDescription
      }
    }
  }
`;
