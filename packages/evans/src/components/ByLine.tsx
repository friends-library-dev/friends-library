import React from 'react';
import { Link } from 'gatsby';
import { t } from 'ttag';
import { Url, Name } from '@friends-library/types';
import { h2 } from '../typography';

type Props = {
  isCompilation: boolean;
  friendUrl: Url;
  friendName: Name;
};

export default ({ isCompilation, friendUrl, friendName }: Props) => {
  if (isCompilation) {
    return null;
  }

  return (
    <h2 css={h2}>
      {t`by`} <Link to={friendUrl}>{friendName}</Link>
    </h2>
  );
};
