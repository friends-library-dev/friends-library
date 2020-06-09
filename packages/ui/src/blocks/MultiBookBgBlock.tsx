import React from 'react';
import cx from 'classnames';
import BackgroundImage from 'gatsby-background-image';
import { FluidBgImageObject } from '@friends-library/types';
import { bgLayer } from '../lib/color';
import './MultiBookBgBlock.css';

interface Props {
  className?: string;
  bright?: boolean;
  bgImg: FluidBgImageObject;
}

const MultiBookBgBlock: React.FC<Props> = ({ children, className, bgImg, bright }) => {
  const opStart = bright ? 0.28 : 0.68;
  const opEnd = bright ? 0.6 : 0.925;
  const percent = bright ? 65 : 75;
  return (
    <BackgroundImage
      Tag="section"
      id="MultiBookBgBlock"
      fluid={[
        `radial-gradient(rgba(0, 0, 0, ${opStart}), rgba(0, 0, 0, ${opEnd}) ${percent}%)`,
        bgImg,
        ...(bright ? [bgLayer(`#444`)] : []),
      ]}
      className={cx(
        className,
        bright && `bright`,
        `py-20 sm:py-32 px-10 sm:px-16 bg-black`,
      )}
    >
      {children}
    </BackgroundImage>
  );
};

export default MultiBookBgBlock;
