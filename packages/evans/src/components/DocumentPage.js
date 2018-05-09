// @flow
import * as React from 'react';
import url from 'lib/url';
import { t } from 'c-3po';
import { Document } from 'classes';
import Divider from './Divider';
import Edition from './Edition';
import PageTitle from './PageTitle';
import ByLine from './ByLine';

type Props = {
  document: Document,
};

const DocumentPage = ({ document }: Props) => {
  const { friend } = document;
  return (
    <div>
      <div>
        <PageTitle>{document.title}</PageTitle>
        <ByLine>
          {t`by`} <a href={url(friend)}>{friend.name}</a>
        </ByLine>
        <p>{document.description}</p>
      </div>
      <Divider />
      <div>
        {document.editions.map(e => <Edition key={e.type} edition={e} />)}
      </div>
    </div>
  );
};

export default DocumentPage;
