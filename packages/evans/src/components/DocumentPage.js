// @flow
import * as React from 'react';
import { Document } from '@friends-library/friends';
import Divider from './Divider';
import Edition from './Edition';
import PageTitle from './PageTitle';
import ByLine from './ByLine';
import Block from './Block';

type Props = {
  document: Document,
};

const DocumentPage = ({ document }: Props) => (
  <Block>
    <div>
      <PageTitle>{document.title}</PageTitle>
      <ByLine document={document} />
      <p>{document.description}</p>
    </div>
    <Divider />
    <div>
      {document.editions.map(e => <Edition key={e.type} edition={e} />)}
    </div>
  </Block>
);

export default DocumentPage;
