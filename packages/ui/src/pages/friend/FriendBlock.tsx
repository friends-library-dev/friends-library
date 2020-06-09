import React from 'react';
import cx from 'classnames';
import { Male, Female } from './Silhouettes';

interface Props {
  name: string;
  gender: 'male' | 'female' | 'mixed';
  blurb: string;
}

const FriendBlock: React.FC<Props> = ({ name, gender, blurb }) => {
  return (
    <div className="p-6 px-12 pb-10 md:p-16 xl:p-24 flex flex-col justify-center items-center md:items-start md:flex-row xl:mx-auto">
      <div className="flex flex-col items-center mb-8">
        {gender === `female` && <Female />}
        {gender === `male` && <Male />}
        <h1 className="font-sans md:hidden font-bold text-xl mt-4 tracking-wider">
          {name}
        </h1>
      </div>
      <div className={cx(gender !== `mixed` && `md:ml-12`, `max-w-4xl mx-auto`)}>
        <h1 className="hidden md:block font-sans font-bold antialiased text-flprimary text-3xl mb-4 tracking-wider">
          {name}
        </h1>
        <p className="body-text">{blurb}</p>
      </div>
    </div>
  );
};

export default FriendBlock;
