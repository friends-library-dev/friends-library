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
    isCompilation: false, // @TODO
    author: friend.name,
    size: 'm', // @TODO
    pages: 222, // @TODO
    edition: document.editions[0].type,
    isbn: '978-1-64476-014-7', // @TODO
    blurb: document.description,
    customCss: '',
    customHtml: '',
  };
  return (
    <Layout>
      <DocBlock
        description={document.description}
        isbn="978-1-64476-004-8"
        customHtml=""
        authorSlug="ambrose-rigge"
        price={499}
        hasAudio={true}
        numChapters={15}
        altLanguageUrl="https://es-evans.netlify.com/james-parnell/vida"
        {...coverProps}
        pages={[222]}
      />
      <ReadSampleBlock price={499} hasAudio={true} chapters={chapters} />
      <ListenBlock />
      <div className="p-8 pt-12" style={{ backgroundColor: 'rgb(249, 249, 249)' }}>
        <h1 className="font-sans font-bold text-2xl text-center mb-8 tracking-wider">
          Other Books by this Author
        </h1>
        <div className="xl:flex justify-center">
          <RelatedBookCard
            lang="en"
            isbn=""
            title="The Journal of Charles&nbsp;Marshall"
            isCompilation={false}
            author="Charles Marshall"
            edition="updated"
            description={shortBlurb}
            customCss=""
            customHtml=""
            authorSlug="charles-marshall"
            documentSlug="journal"
          />
          <RelatedBookCard
            lang="en"
            isbn=""
            title="The Journal of William Savery"
            isCompilation={false}
            author="William Savery"
            edition="modernized"
            description={shortBlurb}
            customCss=""
            customHtml=""
            authorSlug="charles-marshall"
            documentSlug="journal"
          />
          <RelatedBookCard
            lang="es"
            isbn=""
            title="Walk in the Spirit"
            isCompilation={false}
            author="Hugh Turford"
            edition="updated"
            description={shortBlurb}
            customCss=""
            customHtml=""
            authorSlug="charles-marshall"
            documentSlug="journal"
          />
        </div>
      </div>
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
      editions: childrenEdition {
        type
        description
      }
      isCompilation
      description
      slug
      title
      id
    }
  }
`;

const chapters = [
  {
    text: 'This is a chapter title that is way too long',
    shortText: 'This is a chapter title',
    sequence: {
      type: 'Chapter',
      number: 1,
    },
  },
  {
    text: 'This is a chapter title two',
    sequence: {
      type: 'Chapter',
      number: 2,
    },
  },
  {
    text: 'This is a chapter title three',
    sequence: {
      type: 'Chapter',
      number: 3,
    },
  },
  {
    text: 'Epilogue',
  },
];

const shortBlurb = `Ambrose Rigge (1635-1705) was early convinced of the truth through the preaching of George Fox, and grew to be a powerful minister of the gospel, a faithful elder, and a great sufferer for the cause of Christ. In one of his letters, he writes, "I have been in eleven prisons in this county, one of which held me ten years, four months and upward, besides twice premunired, and once publicly lashed, and many other sufferings too long to relate here."`;
