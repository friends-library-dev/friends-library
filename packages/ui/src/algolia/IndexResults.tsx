import React from 'react';
import cx from 'classnames';
import { connectStateResults, Hits } from 'react-instantsearch-dom';
import { HitProps } from './SearchHits';

interface Props {
  title: string;
  icon: 'fa-book' | 'fa-users' | 'fa-file-text';
  searchResults?: { nbHits: number };
  HitComponent: React.FC<HitProps>;
}

const UnconnectedResults: React.FC<Props> = ({
  searchResults,
  icon,
  title,
  HitComponent,
}) => {
  if (!searchResults || searchResults.nbHits === 0) {
    return null;
  }
  return (
    <div>
      <h4 className="border-b m-2 border-solid flex items-center border-flgray-400 pb-px text-lg">
        <i className={cx(icon, `fa mr-2 text-flprimary`)} />
        {`${title} `}
        <span className="opacity-50 text-sm ml-1 tracking-widest">
          ({searchResults.nbHits})
        </span>
      </h4>
      <Hits hitComponent={HitComponent} />
    </div>
  );
};

// @ts-ignore
export default connectStateResults(UnconnectedResults) as React.FC<Props>;
