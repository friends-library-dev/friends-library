import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import DocBlock from '../src/blocks/DocBlock';
import ListenBlock from '../src/blocks/ListenBlock';
import ReadSampleBlock from '../src/blocks/ReadSampleBlock';
import { coverSizes } from './decorators';
import Tablet from '../src/Tablet';
import SampleToc from '../src/SampleToc';
import RelatedBookCard from '../src/RelatedBookCard';
import TocHamburger from '../src/TocHamburger';
import DownloadOptions from '../src/DownloadOptions';

storiesOf('Doc Page', module)
  .addDecorator(coverSizes)
  .addDecorator(centered)
  .addDecorator(storyFn => (
    <div className="bg-gray-800 w-screen h-screen">{storyFn()}</div>
  ))
  .add('TocHamburger', () => <TocHamburger />)
  .add('DownloadOptions', () => <DownloadOptions />)
  .add('Tablet', () => <Tablet />)
  .add('SampleToc', () => <SampleToc onClose={a('close')} chapters={chapters} />)
  .add('RelatedBookCard', () => (
    <div style={{ minWidth: 300 }}>
      <RelatedBookCard
        lang="en"
        isbn=""
        title="The Journal of Charles&nbsp;Marshall"
        author="Charles Marshall"
        isCompilation={false}
        edition="updated"
        description={shortBlurb}
        customCss=""
        customHtml=""
        authorSlug="charles-marshall"
        documentSlug="journal"
      />
    </div>
  ));

storiesOf('Doc Page', module)
  .addDecorator(centered)
  .add('DownloadOptions', () => <DownloadOptions />);

storiesOf('Doc Page', module)
  .addDecorator(coverSizes)
  .add('ReadSampleBlock', () => (
    <ReadSampleBlock price={499} hasAudio={true} chapters={chapters} />
  ))
  .add('ListenBlock', () => <ListenBlock />)
  .add('DocBlock', () => (
    <DocBlock
      lang="en"
      title="The Journal and Writings of Ambrose Rigge"
      author="Ambrose Rigge"
      size="s"
      pages={[222]}
      edition="modernized"
      blurb={blurb}
      description={blurb}
      showGuides={false}
      isCompilation={false}
      customCss=""
      isbn="978-1-64476-004-8"
      customHtml=""
      authorSlug="ambrose-rigge"
      price={499}
      hasAudio={true}
      numChapters={15}
      altLanguageUrl="https://es-evans.netlify.com/james-parnell/vida"
    />
  ));

const blurb = `Ambrose Rigge (1635-1705) was early convinced of the truth through the preaching of George Fox, and grew to be a powerful minister of the gospel, a faithful elder, and a great sufferer for the cause of Christ. In one of his letters, he writes, "I have been in eleven prisons in this county, one of which held me ten years, four months and upward, besides twice premunired, and once publicly lashed, and many other sufferings too long to relate here." Yet through all he kept the faith, and served the Lord's body even while in bonds, through letters and papers given to encourage and establish the flock. Ambrose Rigge was one of many in his generation who sold all to buy the Pearl of great price, and having found true treasure, he kept it till the end.`;

const shortBlurb = `Ambrose Rigge (1635-1705) was early convinced of the truth through the preaching of George Fox, and grew to be a powerful minister of the gospel, a faithful elder, and a great sufferer for the cause of Christ. In one of his letters, he writes, "I have been in eleven prisons in this county, one of which held me ten years, four months and upward, besides twice premunired, and once publicly lashed, and many other sufferings too long to relate here."`;

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
