import React from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import {
  MultiBookBgBlock,
  EmbeddedAudio,
  DuoToneWaveBlock,
  Heading,
} from '@friends-library/ui';
import { SiteMetadata } from '../types';
import { LANG } from '../env';
import { Layout } from '../components';
import GettingStartedPaths from '../components/GettingStartedPaths';

interface Props {
  data: { site: SiteMetadata };
}

const GettingStartedPage: React.FC<Props> = ({
  data: {
    site: { meta },
  },
}) => (
  <Layout>
    <MultiBookBgBlock className="flex flex-col items-center">
      <Heading darkBg className="text-white">
        Not sure where to get started?
      </Heading>
      <p className="text-center body-text text-white text-lg leading-loose max-w-4xl md:text-left">
        Interested in reading something from the early Quakers, but picking from{' '}
        {LANG === 'en' ? meta.numEnglishBooks : meta.numSpanishBooks} books seem daunting?
        No worries&mdash;on this page we've pre-selected our favorites from all the books
        in our library and arranged them into four topics. Plus we've got an introductory
        audio to help introduce you to the early Friends.
      </p>
    </MultiBookBgBlock>
    <DuoToneWaveBlock className="p-12 pb-32">
      <div className="flex flex-col items-center">
        <h2 className="font-sans text-3xl text-center mb-6 tracking-wide md:text-left">
          Step 1: Audio Introduction
        </h2>
        <p className="body-text text-center mb-10 text-lg leading-loose max-w-3xl md:text-left md:pr-20">
          If you haven't listened to our introductory audio explaining who the early
          Quakers were, we recommend you start there by clicking the play button below:
        </p>
        <div className="max-w-3xl w-3/4">
          <EmbeddedAudio
            trackId={242345955}
            title="Introduction to the Early Quakers"
            showArtwork={false}
          />
        </div>
      </div>
    </DuoToneWaveBlock>
    <div className="bg-flgray-100 py-12 px-16">
      <h2 className="font-sans text-3xl text-center mb-6 tracking-wide">
        Step 2: Choose A Path
      </h2>
      <p className="body-text text-lg text-center">
        Now for the only decision you need to make: of the four categories below, what
        interests you the most? Click the one that stands out to see recommendations for
        just that category.
      </p>
    </div>
    <div className="md:flex flex-wrap">
      <PathIntro title="History" color="maroon" onClick={() => {}}>
        <HistoryBlurb />
      </PathIntro>
      <PathIntro title="Doctrine" color="blue" onClick={() => {}}>
        <DoctrineBlurb />
      </PathIntro>
      <PathIntro title="Devotional" color="green" onClick={() => {}}>
        <DevotionalBlurb />
      </PathIntro>
      <PathIntro title="Journals" color="gold" onClick={() => {}}>
        <JournalsBlurb />
      </PathIntro>
    </div>
    <GettingStartedPaths
      {...{ HistoryBlurb, DoctrineBlurb, DevotionalBlurb, JournalsBlurb }}
    />
  </Layout>
);

export default GettingStartedPage;

interface PathIntroProps {
  title: string;
  className?: string;
  color: 'blue' | 'maroon' | 'gold' | 'green';
  onClick: () => void;
}

const PathIntro: React.FC<PathIntroProps> = ({ className, color, title, children }) => (
  <section
    className={cx(
      className,
      `bg-fl${color}`,
      'p-8 pb-4 md:w-1/2 lg:w-1/4 flex flex-col justify-start',
    )}
  >
    <h3 className="font-sans text-white text-center text-3xl tracking-wide mb-8">
      {title}
    </h3>
    <p className="body-text text-white text-md mb-8">{children}</p>
    <div className="flex flex-col items-center mb-10 text-xl mt-auto">
      <button className="text-white uppercase font-sans tracking-wider text-base">
        Learn More
      </button>
      <i className="fa fa-chevron-down text-white antialiased pt-2" />
    </div>
  </section>
);

export const query = graphql`
  query GettingStartedPage {
    site {
      ...SiteMetadata
    }
  }
`;

export const DevotionalBlurb: React.FC = () => (
  <>
    The early Friends left behind a precious treasury of devotional writings which, when
    read by a hungry soul, help kindle the heart with love towards God, faithfulness in
    obedience, meekness towards all fellow-creatures, and a deep humility and watchfulness
    during the time of our sojourning in the body.
  </>
);

export const JournalsBlurb: React.FC = () => (
  <>
    Most common of all the Quaker writings are their journals. These are incredibly
    weighty and helpful records of real women and men walking in the "ancient path" of
    obedience, humility, faith, and love&mdash;overcoming the world not by their own
    strength, but by clinging to the grace of Jesus Christ springing up in the heart.
  </>
);

export const DoctrineBlurb: React.FC = () => (
  <>
    Although they hold much in common with many other biblically Christian groups, there
    are a number of significant distinctive doctrines, principles and testimonies held
    forth by early Friends which set them apart from other Christian communities.
  </>
);

export const HistoryBlurb: React.FC = () => (
  <>
    Get a feel for the history of the early Society of Friends from their own contemporary
    historians. Learn about the context in which they emerged, the great sufferings of the
    early generations, the spread and progress of Truth in Great Britain, colonial
    America, and beyond, and become familiar with many of the notable figures of early
    Quakerism.
  </>
);
