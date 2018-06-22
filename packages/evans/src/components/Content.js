// @flow
import * as React from 'react';
import { get } from 'lib/content';

type Props = {|
  file: string,
|};

export default ({ file }: Props) => (
  <fragment-wrapper dangerouslySetInnerHTML={{ __html: get(file) }} />
);
