import React from 'react';
import { graphql, Link } from 'gatsby';
import { FluidBgImageObject } from '@friends-library/types';
import { t } from '@friends-library/locale';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import {
  Dual,
  Stack,
  Audiobook,
  AudiobooksHero,
  BookTeaserCard,
} from '@friends-library/ui';
import { Layout, Seo } from '../components';

type AudioBookNode = CoverData & {
  authorUrl: string;
  documentUrl: string;
  description: string;
  htmlShortTitle: string;
  editions: {
    audio: {
      duration: string;
    };
  }[];
};

interface Props {
  data: {
    headphones: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    audioBooks: {
      nodes: AudioBookNode[];
    };
    recent: {
      nodes: (AudioBookNode & {
        editions: {
          audio: {
            publishedDate: string;
          };
        }[];
      })[];
    };
  };
}

const AudiobooksPage: React.FC<Props> = ({
  data: { audioBooks, recent, headphones },
}: Props) => (
  <Layout>
    <Seo
      title={t`Audio Books`}
      description={[
        `Browse ${audioBooks.nodes.length} free audiobooks from early members of the Religious Society of Friends (Quakers). Download as a podcast, MP3s, or an M4B file – or listen online in your browser. All books are available in e-Book format as well for free download as EPUB, MOBI, or PDF, and paperback copies are also available at very low cost.`,
        'Dale un vistazo a nuestros audiolibros gratuitos de los primeros miembros de la Sociedad Religiosa de Amigos (Cuáqueros). Puedes descargar el audio como un podcast, MP3, o un archivo M4B - o reproducirlo en línea desde tu navegador. También, los libros completos están disponibles para ser descargados gratuitamente en formatos digitales como EPUB, MOBI, PDF. Libros impresos también están disponibles por un precio muy económico.',
      ]}
    />
    <AudiobooksHero
      bgImg={headphones.image.fluid}
      className="p-16 pb-48 md:pb-56"
      numBooks={audioBooks.nodes.length}
    />
    <div className="bg-flgray-200 py-12 xl:pb-6">
      <Dual.h2 className="sans-wider text-center text-2xl md:text-3xl mb-12 px-10">
        <>Recently Added Audio Books</>
        <>Audiolibros añadidos recientemente</>
      </Dual.h2>
      <Stack
        space="16"
        xl="0"
        className="md:px-6 lg:px-24 xl:px-0 xl:flex flex-wrap justify-center"
      >
        {recent.nodes.map(book => (
          <BookTeaserCard
            key={book.documentUrl}
            className="xl:w-2/5 xl:mx-8 xl:mb-12"
            {...coverPropsFromQueryData(book)}
            htmlShortTitle={book.htmlShortTitle}
            audioDuration={book.editions[0].audio.duration}
            badgeText={book.editions[0].audio.publishedDate}
            authorUrl={book.authorUrl}
            documentUrl={book.documentUrl}
            description={
              book.description ||
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequ'
            }
          />
        ))}
      </Stack>
    </div>
    <div className="pt-16">
      <h2 className="sans-wider text-center text-3xl mb-8 px-8">{t`All Audio Books`}</h2>
      <Dual.p className="body-text text-center text-lg mb-12 px-8 sm:px-10">
        <>
          Browse all {audioBooks.nodes.length} audiobooks below, or{' '}
          <Link to={t`/audio-help`} className="subtle-link">
            get help with listening here
          </Link>
          .
        </>
        <>
          Explora los {audioBooks.nodes.length} audiolibros a continuación u{' '}
          <Link to={t`/audio-help`} className="subtle-link">
            obtén ayuda aquí para escuchar
          </Link>
          .
        </>
      </Dual.p>
      <div className="flex flex-col md:flex-row flex-wrap items-center md:items-stretch justify-center">
        {audioBooks.nodes.map((book, idx) => (
          <Audiobook
            key={book.documentUrl}
            className="mb-12 sm:w-4/5 md:w-2/5 md:box-content md:mx-4 xl:w-1/4 xl:max-w-3xl"
            {...coverPropsFromQueryData(book)}
            htmlShortTitle={book.htmlShortTitle}
            bgColor={['blue', 'green', 'gold'][idx % 3] as 'blue' | 'green' | 'gold'}
            duration={(book.editions[0].audio || { duration: book.documentUrl }).duration}
            authorUrl={book.authorUrl}
            documentUrl={book.documentUrl}
            description={book.description}
          />
        ))}
      </div>
    </div>
  </Layout>
);

export default AudiobooksPage;

export const query = graphql`
  {
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
        authorUrl
        description: partialDescription
        editions {
          audio {
            duration
          }
        }
      }
    }
    recent: allDocument(
      filter: { hasAudio: { eq: true } }
      sort: { fields: editions___audio___added, order: DESC }
      limit: 2
    ) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
        authorUrl
        description: partialDescription
        editions {
          audio {
            duration
            publishedDate
          }
        }
      }
    }
    headphones: file(relativePath: { eq: "headphones.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
