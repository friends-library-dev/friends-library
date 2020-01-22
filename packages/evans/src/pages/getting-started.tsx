import React from 'react';
import cx from 'classnames';
import {
  MultiBookBgBlock,
  EmbeddedAudio,
  DuoToneWaveBlock,
  Heading,
} from '@friends-library/ui';
import { Layout } from '../components';
import GettingStartedPaths from '../components/GettingStartedPaths';

export default () => (
  <Layout>
    <MultiBookBgBlock className="flex flex-col items-center">
      <Heading darkBg className="text-white">
        Not sure where to get started?
      </Heading>
      <p className="text-center body-text text-white text-lg leading-loose max-w-4xl md:text-left">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium ea ullam
        culpa eveniet? Facere enim tempora consequuntur recusandae adipisci fugiat itaque
        sit dolorum? Sunt, perspiciatis quasi. Dolorem recusandae temporibus cupiditate.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit neque
        necessitatibus, asperiores tenetur, sint est doloribus repudiandae assumenda
        corporis provident, nisi nam eum aliquam ratione tempora enim! Corporis, quasi
        doloremque.
      </p>
    </MultiBookBgBlock>
    <DuoToneWaveBlock className="p-12 pb-32">
      <div className="flex flex-col items-center">
        <h2 className="font-sans text-3xl text-center mb-6 tracking-wide md:text-left">
          Listen to the Beginnings
        </h2>
        <p className="body-text text-center mb-10 max-w-3xl md:text-left md:pr-20">
          First, if you haven't listened to our introductory audio explaining who the
          early Quakers were, we recommend you start there by clicking the play button
          below:
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
    <div className="bg-flgray-100 p-12">
      <h2 className="font-sans text-3xl text-center mb-6 tracking-wide">Choose A Path</h2>
      <p className="body-text text-lg text-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla reprehenderit nemo,
        eaque, officia mollitia provident repellendus sit nesciunt dicta et voluptatibus
        vero voluptate, necessitatibus voluptatem explicabo. Voluptatum officia minus
        aliquam.
      </p>
    </div>
    <div className="md:flex flex-wrap">
      <PathIntro title="History" color="maroon" onClick={() => {}}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus veritatis
        sapiente obcaecati, aut officia illum in, cumque consequuntur est repellendus,
        tempora voluptatibus dignissimos ad mollitia aliquam ratione minima maiores eum.
      </PathIntro>
      <PathIntro title="Doctrine" color="blue" onClick={() => {}}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus veritatis
        sapiente obcaecati, aut officia illum in, cumque consequuntur est repellendus,
        tempora voluptatibus dignissimos ad mollitia aliquam ratione minima maiores eum.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus veritatis
        e pluribus unum.
      </PathIntro>
      <PathIntro title="Devotional" color="green" onClick={() => {}}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus veritatis
        sapiente obcaecati, aut officia illum in, cumque consequuntur est repellendus,
        tempora voluptatibus dignissimos ad mollitia aliquam ratione minima maiores eum.
        Tempora voluptatibus dignissimos ad mollitia aliquam ratione minima maiores eum.
      </PathIntro>
      <PathIntro title="Journals" color="gold" onClick={() => {}}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus veritatis
        sapiente obcaecati, aut officia illum in, cumque consequuntur est repellendus,
        tempora voluptatibus dignissimos ad mollitia aliquam ratione minima maiores eum.
      </PathIntro>
    </div>
    <GettingStartedPaths />
  </Layout>
);

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
