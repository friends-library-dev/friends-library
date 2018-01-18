// @flow
import * as React from 'react';
import { css } from 'glamor';
import url from '../lib/url';
import { classes } from '../lib/css';
import Document from '../classes/Document';
import Divider from './Divider';
import Edition from './Edition';
import { h1, h2 } from './Typography';

const element = css`
  padding: 15px;
`;

const title = css`
  margin: 10px 0 25px;
`;

type Props = {
  document: Document,
};

const DocumentPage = ({ document }: Props) => {
  const { friend } = document;
  return (
    <div className={element}>
      <div>
        <h1 className={classes(title, h1)}>{document.title}</h1>
        <h2 className={h2}>
          by <a href={url(friend)}>{friend.name}</a>
        </h2>
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
