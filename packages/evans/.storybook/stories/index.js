// @flow
import * as React from 'react';
import { safeLoad } from 'js-yaml';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { getFriend } from '@friends-library/friends';
import StickyNav from '../../src/components/StickyNav';
import DocumentTeaser from '../../src/components/DocumentTeaser';
import FriendPage from '../../src/components/FriendPage';
import DocumentPage from '../../src/components/DocumentPage';
import Edition from '../../src/components/Edition';
import '../../src/components/App.css';

const rebecca = getFriend('rebecca-jones');
const journal = rebecca.documents[0];

const Padded = (storyFn: () => React.Node) => (
  <div style={{ padding: '30px' }}>
    { storyFn() }
  </div>
);

storiesOf('StickyNav', module)
  .add('default', () => (
    <StickyNav toggleSlideover={action('toggle slideover')} />
  ));

storiesOf('DocumentTeaser', module)
  .addDecorator(Padded)
  .add('default', () => <DocumentTeaser document={journal} friend={rebecca} />);

storiesOf('FriendPage', module)
  .add('default', () => <FriendPage friend={rebecca} />);

storiesOf('DocumentPage', module)
  .add('default', () => <DocumentPage document={journal} />);

storiesOf('Edition', module)
  .addDecorator(Padded)
  .add('default', () => <Edition edition={journal.editions[0]} />);
