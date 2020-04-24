import React from 'react';
import { graphql } from 'gatsby';
import { FluidBgImageObject } from '@friends-library/types';
import { t } from '@friends-library/locale';
import {
  ExploreNavBlock,
  ExploreUpdatedEditionsBlock,
  ExploreGettingStartedLinkBlock,
  ExploreAudioBooksBlock,
  ExploreNewBooksBlock,
  ExploreTimelineBlock,
  ExploreRegionBlock,
  ExploreAltSiteBlock,
  ExploreSearchBlock,
  Dual,
} from '@friends-library/ui';
import { Layout, Seo } from '../components';
import BooksBgBlock from '../components/BooksBgBlock';
import { SiteMetadata } from '../types';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { APP_ALT_URL, LANG } from '../env';

const ExplorePage: React.FC<Props> = ({
  data: {
    updatedEditions,
    audioBooks,
    newBooks,
    booksByDate,
    regionBooks,
    searchBooks,
    site,
    headphones,
    books3,
    waterPath,
    castle,
  },
}) => (
  <Layout>
    <Seo
      title={t`Explore Books`}
      description={[
        `Explore ${site.meta.numEnglishBooks} books written by early members of the Religious Society of Friends (Quakers) – available for free download as EPUB, MOBI, PDF, and audiobooks. Browse ${updatedEditions.nodes.length} updated editions, ${audioBooks.nodes.length} audiobooks, and recently added titles, or view books by geographic region or time period.`,
        `Explora nuestros ${site.meta.numSpanishBooks} libros escritos por los primeros miembros de la Sociedad de Amigos (Cuáqueros), disponibles de forma gratuita en formatos digitales EPUB, MOBI, PDF, y audiolibros. Puedes navegar por todos nuestros libros y audiolibros, o buscar libros en la categoría particular que más te interese.`,
      ]}
    />
    <BooksBgBlock bright>
      <div className="bg-white text-center py-12 md:py-16 lg:py-20 px-10 sm:px-16 my-6 max-w-screen-md mx-auto">
        <Dual.h1 className="sans-wider text-3xl mb-6">
          <>Explore Books</>
          <>Explorar Libros</>
        </Dual.h1>
        <Dual.p className="body-text">
          <>
            We currently have {site.meta.numEnglishBooks} books freely available on this
            site. Overwhelmed? On this page you can browse all the titles by edition,
            region, time period, tags, and more&mdash;or search the full library to find
            exactly what you’re looking for.
          </>
          <>
            Actualmente tenemos {site.meta.numSpanishBooks} libros disponibles de forma
            gratuita en este sitio, y más están siendo traducidos y añadidos regularmente.
            En nuestra página de “Explorar” puedes navegar por todos nuestros libros y
            audiolibros, o buscar libros en la categoría particular que más te interese.
          </>
        </Dual.p>
      </div>
    </BooksBgBlock>
    <ExploreNavBlock />
    <ExploreUpdatedEditionsBlock
      books={updatedEditions.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        htmlShortTitle: data.htmlShortTitle,
        documentUrl: data.documentUrl,
        authorUrl: data.authorUrl,
      }))}
    />
    <ExploreGettingStartedLinkBlock bgImg={books3.image.fluid} />
    <ExploreAudioBooksBlock
      bgImg={headphones.image.fluid}
      books={audioBooks.nodes.map(data => ({
        ...coverPropsFromQueryData(data),
        htmlShortTitle: data.htmlShortTitle,
        documentUrl: data.documentUrl,
      }))}
    />
    <ExploreNewBooksBlock
      books={newBooks.nodes.slice(0, LANG === 'es' ? 2 : 4).map(data => ({
        ...coverPropsFromQueryData(data),
        documentUrl: data.documentUrl,
        htmlShortTitle: data.htmlShortTitle,
        authorUrl: data.authorUrl,
        badgeText: data.editions[0].badgeText,
        description:
          data.description ||
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      }))}
    />
    {LANG === 'en' && (
      <ExploreRegionBlock
        books={regionBooks.nodes.map(data => ({
          ...coverPropsFromQueryData(data),
          htmlShortTitle: data.htmlShortTitle,
          region: data.region as any,
          documentUrl: data.documentUrl,
          authorUrl: data.authorUrl,
        }))}
      />
    )}
    {LANG === 'en' && (
      <ExploreTimelineBlock
        bgImg={castle.image.fluid}
        books={booksByDate.nodes.map(data => ({
          ...coverPropsFromQueryData(data),
          htmlShortTitle: data.htmlShortTitle,
          date: data.date,
          documentUrl: data.documentUrl,
          authorUrl: data.authorUrl,
        }))}
      />
    )}
    <ExploreAltSiteBlock
      url={APP_ALT_URL}
      numBooks={site.meta[LANG === 'en' ? 'numSpanishBooks' : 'numEnglishBooks']}
    />
    <ExploreSearchBlock
      bgImg={waterPath.image.fluid}
      books={searchBooks.nodes.flatMap(data =>
        data.editions.map(edition => ({
          ...coverPropsFromQueryData({ ...data, editions: [edition] }),
          htmlShortTitle: data.htmlShortTitle,
          tags: data.tags,
          period: data.period as any,
          region: data.region as any,
          documentUrl: data.documentUrl,
          authorUrl: data.authorUrl,
        })),
      )}
    />
  </Layout>
);

interface Props {
  data: {
    site: SiteMetadata;
    searchBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        authorUrl: string;
        tags: string[];
        period: string;
        region: string;
      })[];
    };
    newBooks: {
      nodes: (CoverData & {
        documentUrl: string;
        htmlShortTitle: string;
        authorUrl: string;
        editions: {
          badgeText: string;
        }[];
        description?: string;
      })[];
    };
    audioBooks: {
      nodes: (CoverData & { documentUrl: string; htmlShortTitle: string })[];
    };
    regionBooks: {
      nodes: (CoverData & {
        authorUrl: string;
        documentUrl: string;
        region: string;
        htmlShortTitle: string;
      })[];
    };
    updatedEditions: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        htmlShortTitle: string;
      })[];
    };
    booksByDate: {
      nodes: (CoverData & {
        documentUrl: string;
        authorUrl: string;
        date: number;
        htmlShortTitle: string;
      })[];
    };
    books3: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    waterPath: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    castle: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    headphones: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
  };
}

export const query = graphql`
  query ExplorePage {
    site {
      ...SiteMetadata
    }
    searchBooks: allDocument {
      nodes {
        ...CoverProps
        tags
        period
        authorUrl
        documentUrl: url
        htmlShortTitle
        region
      }
    }
    regionBooks: allDocument(filter: { region: { ne: "Other" } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
        authorUrl
        region
      }
    }
    booksByDate: allDocument {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        htmlShortTitle
        date
      }
    }
    newBooks: allDocument(
      sort: { fields: editions___publishedTimestamp, order: DESC }
      limit: 4
    ) {
      nodes {
        ...CoverProps
        editions {
          badgeText: publishedDate
        }
        description: partialDescription
        authorUrl
        documentUrl: url
        htmlShortTitle
      }
    }
    audioBooks: allDocument(filter: { hasAudio: { eq: true } }) {
      nodes {
        ...CoverProps
        documentUrl: url
        htmlShortTitle
      }
    }
    updatedEditions: allDocument(
      filter: { editions: { elemMatch: { type: { eq: "updated" } } } }
    ) {
      nodes {
        ...CoverProps
        authorUrl
        documentUrl: url
        htmlShortTitle
      }
    }
    books3: file(relativePath: { eq: "Books3.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    waterPath: file(relativePath: { eq: "water-path.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    castle: file(relativePath: { eq: "castle.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
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

export default ExplorePage;
