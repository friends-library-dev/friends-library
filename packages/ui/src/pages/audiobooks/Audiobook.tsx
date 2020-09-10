import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { CoverProps } from '@friends-library/types';
import { t } from '@friends-library/locale';
import Album from '../../Album';
import AudioDuration from '../../AudioDuration';
import Button from '../../Button';
import Stack from '../../layout/Stack';
import './Audiobook.css';

type Props = Omit<CoverProps, 'size' | 'pages' | 'blurb'> & {
  bgColor: 'blue' | 'maroon' | 'gold' | 'green';
  duration: string;
  documentUrl: string;
  htmlShortTitle: string;
  authorUrl: string;
  description: string;
  className?: string;
};

const Audiobook: React.FC<Props> = (props) => (
  <div
    className={cx(
      props.className,
      `Audiobook flex flex-col items-center`,
      // purgeCSS: text-flblue text-flmaroon text-flgold text-flgreen
      `text-fl${props.bgColor}`,
    )}
  >
    <Album {...props} className="" />
    <Stack
      // purgeCSS: mb-8
      space="8"
      className="flex-grow text-white sans-wide text-center -mt-6 antialiased pt-16 pb-12 px-10 flex flex-col"
    >
      <h3
        key="title"
        className="text-lg sans-wider"
        dangerouslySetInnerHTML={{ __html: props.htmlShortTitle }}
      />
      <h4 className="-mt-3" key="author">
        <Link to={props.authorUrl} className="fl-underline">
          {props.author}
        </Link>
      </h4>
      <AudioDuration textColor="white" key="duration">
        {props.duration}
      </AudioDuration>
      <p className="body-text text-white -mt-2" key="desc">
        {props.description}
      </p>
      <Button
        key="button"
        to={`${props.documentUrl}#audiobook`}
        bg={null}
        textColor="black"
        className="bg-flgray-200 hover:bg-white mx-auto mt-auto"
      >
        {t`Listen`}
      </Button>
    </Stack>
  </div>
);

export default Audiobook;
