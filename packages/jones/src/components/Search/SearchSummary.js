// @flow
import * as React from 'react';
import type { SearchResult } from '../../type';

type Props = {|
  results: Array<SearchResult>,
|};

const SearchSummary = ({ results }: Props) => {
  if (results.length === 0) {
    return <p>Found no results. ¯\_(ツ)_/¯</p>;
  }

  const dismissed = results.filter(result => result.dismissed);
  const found = dismissed.length ? 'Showing' : 'Found';
  const number = dismissed.length
    ? `${results.length - dismissed.length}/${results.length}`
    : results.length;

  if (results.length === 1) {
    return <p>{found} <code>{number}</code> result:</p>
  } else {
    return <p>{found} <code>{number}</code> results:</p>
  }
}

export default SearchSummary;
