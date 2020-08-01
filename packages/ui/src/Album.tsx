import React from 'react';
import cx from 'classnames';
import { Front } from '@friends-library/cover-component';
import LogoFriends from './LogoFriends';
import LogoAmigos from './LogoAmigos';
import { CoverProps } from '@friends-library/types';
import { LANG } from './env';
import './Album.css';

type Props = Omit<CoverProps, 'blurb' | 'pages' | 'size'> & {
  className?: string;
};

const Album: React.FC<Props> = (props) => {
  const Logo = LANG === `en` ? LogoFriends : LogoAmigos;
  return (
    <div className={cx(props.className, `Album box-content shadow-xl relative`)}>
      <Logo
        iconColor="white"
        friendsColor="white"
        libraryColor="white"
        className="absolute z-50 h-3 bottom-0 right-0 opacity-50 m-1"
      />
      <Front {...props} className="" size="m" scaler={1 / 3} scope="1-3" />
    </div>
  );
};

export default Album;
