// @flow
import React from 'react';
import { t } from 'c-3po';
import { css } from 'glamor';
import { Friend } from 'classes';
import { classes } from 'lib/css';
import Divider from './Divider';
import Badge from './Badge';
import DocumentTeaser from './DocumentTeaser';
import { h1, h2 } from './Typography';

const title = css`
  margin: 10px 0 25px;
`;

const docs = css`
  > span {
    margin-left: 6px;
  }
`;

type Props = {
  friend: Friend,
};

const FriendPage = ({ friend }: Props) => {
  if (!friend) {
    return null;
  }

  const { documents } = friend;
  return (
    <div>
      <section>
        <h1 className={classes(title, h1)}>{friend.name}</h1>
        <p>
          {friend.description}
        </p>
      </section>
      <Divider />
      <section>
        <h2 className={classes(docs, h2)}>
          {t`Documents`}:
          <Badge>{documents.length}</Badge>
        </h2>
        {documents.map(d => <DocumentTeaser key={d.slug} document={d} />)}
      </section>
    </div>
  );
};

export default FriendPage;
