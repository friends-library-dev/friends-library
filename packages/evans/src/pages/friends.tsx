import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { FluidBgImageObject } from '@friends-library/types';
import {
  FriendsPageCompilationsBlock,
  FriendsPageHero,
  FriendsPageControlsBlock,
  FriendCard,
  Stack,
  t,
} from '@friends-library/ui';
import { Seo, Layout } from '../components';

const FriendsPage: React.FC<Props> = ({
  data: { allFriend, recent, street, village },
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('First Name');
  const filteredFriends = allFriend.nodes
    .sort(makeSorter(sortOption))
    .filter(makeFilter(searchQuery, sortOption));

  return (
    <Layout>
      <Seo
        title={t`All Friends`}
        description={[
          `Friends Library currently contains books written by ${allFriend.nodes.length} early members of the Religious Society of Friends (Quakers), and more authors are being added regularly. View all authors here, including William Penn, Isaac Penington, Robert Barclay, and George Fox. All books are available in their entirety for free download as EPUB, MOBI, PDF, and a growing number are available as audiobooks. Paperback copies are also available at very low cost.`,
          `Actualmente la Biblioteca de Amigos contiene libros escritos por ${allFriend.nodes.length} antiguos Amigos, y constantemente estamos añadiendo nuevos autores. Aquí puedes ver todos nuestros autores, incluyendo William Penn, Isaac Penington, Robert Barclay, y George Fox. Los libros completos están disponibles para ser descargados gratuitamente en formatos digitales como EPUB, MOBI, PDF, y algunos han sido grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico.`,
        ]}
      />
      <FriendsPageHero numFriends={allFriend.nodes.length} bgImg={street.image.fluid} />
      <div className="pt-10 pb-20 sm:px-24 md:px-16 lg:px-32 xl:px-0 xl:pt-20 xl:pb-24">
        <h2 className="text-center pb-8 sans-wider text-2xl px-8">{t`Recently Added Authors`}</h2>
        {/* purgeCSS: mb-20 md:mb-12 xl:mb-0 */}
        <Stack space="20" md="12" xl="0" className="xl:flex justify-center">
          {recent.nodes.map((friend, idx) => (
            <FriendCard
              featured
              className="xl:w-1/2 xl:mx-6 xl:max-w-screen-sm"
              {...cardProps(friend, idx)}
            />
          ))}
        </Stack>
      </div>
      <FriendsPageControlsBlock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <div className="bg-flgray-200 flex justify-center">
        <div
          className="flex flex-wrap max-w-screen-xl justify-center pb-12 lg:pb-20"
          style={{ minHeight: '30vh' }}
        >
          {filteredFriends.length === 0 && (
            <p className="self-center sans-wide text-lg pt-10 text-gray-800">
              {t`Your search returned no results`}.
            </p>
          )}
          {filteredFriends.length > 0 &&
            filteredFriends.map((friend, idx) => (
              <FriendCard
                className="w-lg mb-12 mx-4 xl:mx-10"
                {...cardProps(friend, idx)}
              />
            ))}
        </div>
      </div>
      <FriendsPageCompilationsBlock bgImg={village.image.fluid} />
    </Layout>
  );
};

export default FriendsPage;

function cardProps(
  friend: FriendData,
  idx: number,
): React.ComponentProps<typeof FriendCard> & { key: string } {
  return {
    key: friend.url,
    color: ['flblue', 'flgreen', 'flmaroon', 'flgold'][idx % 4],
    name: friend.name,
    region: `${friend.primaryResidence.city}, ${friend.primaryResidence.region}`,
    born: friend.born || undefined,
    died: friend.died || undefined,
    gender: friend.gender,
    url: friend.url,
    numBooks: friend.documents.filter(doc => doc.hasNonDraftEdition).length,
  };
}

function makeSorter(
  sortOption: string,
): (friendA: FriendData, friendB: FriendData) => 1 | 0 | -1 {
  switch (sortOption) {
    case 'Death Date':
      return (a, b) => ((a?.died || 0) < (b?.died || 0) ? -1 : 1);
    case 'Birth Date':
      return (a, b) => ((a?.born || 0) < (b?.born || 0) ? -1 : 1);
    case 'Last Name':
      return (a, b) =>
        (a.name.split(' ').pop() || '') < (b.name.split(' ').pop() || '') ? -1 : 1;
    default:
      return (a, b) => (a.name < b.name ? -1 : 1);
  }
}

function makeFilter(query: string, sortOption: string): (friend: FriendData) => boolean {
  return friend => {
    if (sortOption === 'Death Date' && !friend.died) {
      return false;
    }
    if (sortOption === 'Birth Date' && !friend.born) {
      return false;
    }
    return (
      query.trim() === '' ||
      friend.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  };
}

interface FriendNode {
  name: string;
  gender: 'male' | 'female';
  url: string;
  born?: number | null;
  died?: number | null;
  primaryResidence: { city: string; region: string };
  documents: { hasNonDraftEdition: boolean }[];
}

interface Props {
  data: {
    allFriend: {
      nodes: FriendNode[];
    };
    recent: {
      nodes: FriendNode[];
    };
    village: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
    street: {
      image: {
        fluid: FluidBgImageObject;
      };
    };
  };
}

type FriendData = Props['data']['allFriend']['nodes'][0];

export const query = graphql`
  {
    allFriend(
      filter: {
        hasNonDraftDocument: { eq: true }
        slug: { nin: ["compilations", "compilaciones"] }
      }
    ) {
      nodes {
        name
        gender
        born
        died
        url
        primaryResidence {
          city
          region
        }
        documents: childrenDocument {
          hasNonDraftEdition
        }
      }
    }
    recent: allFriend(
      sort: { fields: added, order: DESC }
      limit: 2
      filter: { slug: { nin: ["compilations", "compilaciones"] } }
    ) {
      nodes {
        name
        gender
        born
        died
        url
        primaryResidence {
          city
          region
        }
        documents: childrenDocument {
          hasNonDraftEdition
        }
      }
    }
    village: file(relativePath: { eq: "village.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    street: file(relativePath: { eq: "street.jpg" }) {
      image: childImageSharp {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
