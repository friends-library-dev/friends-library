import React, { useState } from 'react';
import { graphql } from 'gatsby';
import {
  FriendsPageHero,
  FriendsPageCompilationsBlock,
  FriendsPageControlsBlock,
  FriendCard,
  Stack,
} from '@friends-library/ui';
import Layout from '../components/Layout';

export default ({ data: { allFriend } }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('First Name');
  const filteredFriends = allFriend.nodes
    .sort(makeSorter(sortOption))
    .filter(makeFilter(searchQuery, sortOption));
  return (
    <Layout>
      <FriendsPageHero numFriends={allFriend.nodes.length} />
      <div className="pt-10 pb-20 sm:px-24 md:px-16 lg:px-32 xl:px-0 xl:pt-20 xl:pb-24">
        <h2 className="text-center pb-8 sans-wider text-2xl">Recently Added Authors</h2>
        <Stack space="20" md="12" xl="0" className="xl:flex justify-center">
          {allFriend.nodes.slice(-2).map((friend, idx) => (
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
              Your search returned no results.
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
      <FriendsPageCompilationsBlock />
    </Layout>
  );
};

function cardProps(
  friend: FriendData,
  idx: number,
): React.ComponentProps<typeof FriendCard> & { key: string } {
  return {
    key: friend.url,
    color: ['flblue', 'flgreen', 'flmaroon', 'flgold'][idx % 4],
    name: friend.name,
    region: 'London, England',
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

interface Props {
  data: {
    allFriend: {
      nodes: {
        name: string;
        gender: 'male' | 'female';
        url: string;
        born?: number | null;
        died?: number | null;
        documents: { hasNonDraftEdition: boolean }[];
      }[];
    };
  };
}

type FriendData = Props['data']['allFriend']['nodes'][0];

export const query = graphql`
  {
    allFriend(filter: { hasNonDraftDocument: { eq: true } }) {
      nodes {
        name
        gender
        born
        died
        url
        documents: childrenDocument {
          hasNonDraftEdition
        }
      }
    }
  }
`;
