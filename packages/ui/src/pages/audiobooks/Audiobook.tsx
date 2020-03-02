import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { CoverProps } from '@friends-library/types';
import Album from '../../Album';
import AudioDuration from '../../AudioDuration';
import Button from '../../Button';
import Stack from '../../layout/Stack';
import './Audiobook.css';

type Props = Omit<CoverProps, 'size' | 'pages' | 'blurb'> & {
  bgColor: 'blue' | 'maroon' | 'gold' | 'green';
  duration: string;
  documentUrl: string;
  authorUrl: string;
  description: string;
  className?: string;
};

const Audiobook: React.FC<Props> = props => (
  <div
    className={cx(
      props.className,
      'Audiobook flex flex-col items-center',
      `text-fl${props.bgColor}`,
    )}
  >
    <Album {...props} className="" />
    <Stack
      space="8"
      className="text-white sans-wide text-center -mt-6 antialiased py-16 px-10"
    >
      <h3 className="text-lg sans-wider">{props.title}</h3>
      <h4 className="-mt-3">
        <Link to={props.authorUrl} className="fl-underline">
          {props.author}
        </Link>
      </h4>
      <AudioDuration>{props.duration}</AudioDuration>
      <p className="body-text text-white -mt-2">{props.description}</p>
      <Button
        to={`${props.documentUrl}#ListenBlock`}
        bg={null}
        textColor="black"
        className="bg-flgray-200 mx-auto"
      >
        Listen
      </Button>
    </Stack>
  </div>
);

export default Audiobook;
