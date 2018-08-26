// @flow
import * as React from 'react';
import { t } from 'c-3po';
import { Document } from '@friends-library/friends';
import url from '../lib/url';
import { h2 } from './Typography';

type Props = {|
  document: Document
|};

export default ({ document }: Props) => {
  if (document.isCompilation()) {
    return null;
  }

  return (
    <h2 className={h2}>
      {t`by`} <a href={url(document.friend)}>{document.friend.name}</a>
    </h2>
  );
};
