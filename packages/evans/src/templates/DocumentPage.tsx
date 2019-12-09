import React from 'react';
import { graphql } from 'gatsby';
import {
  EditionType,
  Url,
  Title,
  Name,
  Slug,
  Uuid,
  Description,
  CoverProps,
  PrintSize,
  ISBN,
  Heading,
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
      slug: Slug;
      url: Url;
    };
    document: {
      id: Uuid;
      slug: Slug;
      title: Title;
      description: Description;
      altLanguageUrl: Url | null;
      isCompilation: boolean;
      editions: {
        type: EditionType;
        isbn: ISBN;
        price: number;
        chapterHeadings: Heading[];
        numChapters: number;
        description: Description | null;
        printSize: PrintSize;
        pages: number[];
        audio: null | { reader: Name };
      }[];
    };
  };
}

export default ({ data: { friend, document } }: Props) => {
  const mainEdition = document.editions[0];
  const hasAudio = !!mainEdition.audio;
  const coverProps: CoverProps = {
    lang: process.env.GATSBY_LANG === 'en' ? 'en' : 'es',
    title: document.title,
    isCompilation: document.isCompilation,
    author: friend.name,
    size: mainEdition.printSize,
    pages: mainEdition.pages[0], // use first vol if 2-vol faux-vols
    edition: mainEdition.type,
    isbn: mainEdition.isbn,
    blurb: document.description,
    customCss: '',
    customHtml: '',
  };
  return (
    <Layout>
      <DocBlock
        description={document.description}
        isbn={mainEdition.isbn}
        customHtml=""
        authorSlug={friend.slug}
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
        chapterHeadings {
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
  }
`;

const shortBlurb = `Ambrose Rigge (1635-1705) was early convinced of the truth through the preaching of George Fox, and grew to be a powerful minister of the gospel, a faithful elder, and a great sufferer for the cause of Christ. In one of his letters, he writes, "I have been in eleven prisons in this county, one of which held me ten years, four months and upward, besides twice premunired, and once publicly lashed, and many other sufferings too long to relate here."`;
