import React from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import {
  FriendBlock,
  FeaturedQuoteBlock,
  BookByFriend,
  TestimonialsBlock,
  RelatedBookCard,
  FriendMeta,
  MapBlock,
} from '@friends-library/ui';
import { coverPropsFromQueryData, CoverData } from '../lib/covers';
import { Name, Description } from '@friends-library/types';
import { Layout } from '../components';
import './FriendPage.css';

interface Props {
  data: {
    friend: {
      gender: 'male' | 'female';
      name: Name;
      description: Description;
      documents: (CoverData & { tags: string[]; url: string; hasAudio: boolean })[];
      residences: {
        city: string;
        country: string;
        top: number;
        left: number;
        durations: {
          start: number;
          end: number;
        }[];
      }[];
    };
  };
}

export default ({ data: { friend } }: Props) => {
  const isOnlyBook = friend.documents.length === 1;
  return (
    <Layout>
      <FriendBlock name={friend.name} gender={friend.gender} blurb={friend.description} />
      <FeaturedQuoteBlock
        quote="Humbling herself before God and men, she was exalted by the Lord as a powerful and prophetic minister, one of the few in her day who stood in the purity and power of the original Quakers, even while all around her the 200 year old lampstand of the Society of Friends slowly and tragically burned out."
        cite="Ann Branson"
      />
      <div className="bg-flgray-100 px-8 pt-12 pb-4 lg:px-8">
        <h2 className="text-xl font-sans text-center tracking-wider font-bold mb-8">
          Books by {friend.name}
        </h2>
        <div
          className={cx('flex flex-col items-center ', 'xl:justify-center', {
            'lg:flex-row lg:justify-between lg:flex-wrap lg:items-stretch': !isOnlyBook,
          })}
        >
          {friend.documents.map(doc => {
            const props = coverPropsFromQueryData(doc);
            return (
              <BookByFriend
                key={doc.url}
                isAlone={isOnlyBook}
                className="mb-8 lg:mb-12"
                tags={doc.tags}
                hasAudio={doc.hasAudio}
                bookUrl={doc.url}
                {...props}
              />
            );
          })}
        </div>
      </div>
      <div className="FriendMetaBlock bg-white p-8 md:flex md:justify-center lg:py-12">
        <StyledFriendMeta color="green" title="Author Facts">
          <li>Lived: 1801</li>
          <li>Died: 1891</li>
          <li>City: London</li>
          <li>Country: Great Britain</li>
          <li>Role: Elder</li>
        </StyledFriendMeta>
        <StyledFriendMeta color="blue" title="Mentions">
          <li>The Journal of Ann Branson</li>
          <li>The Journal of David Ferris</li>
        </StyledFriendMeta>
        <StyledFriendMeta color="gold" title="Friends of Ann">
          <li>David Ferris</li>
          <li>Ambrose Rigge</li>
          <li>Charles Marshall</li>
        </StyledFriendMeta>
      </div>
      <MapBlock
        friendName={friend.name}
        residences={friend.residences.flatMap(r =>
          r.durations.map(d => `${r.city}, ${r.country} (${d.start} - ${d.end})`),
        )}
        markers={friend.residences.map(r => ({
          label: `${r.city}, ${r.country}`,
          top: r.top,
          left: r.top,
        }))}
      />
      <TestimonialsBlock
        testimonials={[
          {
            quote: LOREM,
            cite: 'George Fox',
          },
          {
            quote: LOREM,
            cite: 'Rebecca Jones',
          },
          {
            quote: LOREM,
            cite: 'Comfort Collins',
          },
          {
            quote: LOREM,
            cite: 'Richard Hubberthorne',
          },
        ]}
      />
      <div className="RelatedBooks bg-flgray-100 p-8 lg:flex lg:flex-wrap lg:justify-center">
        <RelatedBookCard
          className="mb-8 lg:w-1/2 border-flgray-100"
          lang="en"
          title="The Journal of George Fox"
          isCompilation={false}
          author="George Fox"
          edition="original"
          isbn=""
          customHtml=""
          customCss=""
          authorUrl="/friend/george-fox"
          documentUrl="/george-fox/journal"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis."
        />
        <RelatedBookCard
          className="mb-8 lg:w-1/2 border-flgray-100"
          lang="en"
          title="The Journal of Charles Marshall"
          isCompilation={false}
          author="Charles Marshall"
          edition="updated"
          isbn=""
          customHtml=""
          customCss=""
          authorUrl="/friend/charles-marshall"
          documentUrl="/charles-marshall/journal"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis."
        />
        <RelatedBookCard
          className="mb-8 lg:w-1/2 border-flgray-100"
          lang="en"
          title="Life and Letters of Samuel Fothergill"
          isCompilation={false}
          author="Samuel Fothergill"
          edition="modernized"
          isbn=""
          customHtml=""
          customCss=""
          authorUrl="/friend/samuel-fothergill"
          documentUrl="/samuel-fothergill/life-letters"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis."
        />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query GetFriend($slug: String!) {
    friend(slug: { eq: $slug }) {
      name
      gender
      description
      documents: childrenDocument {
        ...CoverProps
        slug
        title
        hasAudio
        tags
        url
      }
      residences {
        city
        country
        map
        top
        left
        durations {
          start
          end
        }
      }
    }
  }
`;

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const StyledFriendMeta: typeof FriendMeta = ({ color, title, children }) => (
  <FriendMeta className="mb-8 md:mb-0 md:w-1/3 md:mr-6" color={color} title={title}>
    {children}
  </FriendMeta>
);
