// @flow
import * as React from 'react';
import { css } from 'glamor';
import { Document } from 'classes';
import url from 'lib/url';
import PageTitle from './PageTitle';
import ByLine from './ByLine';
import Divider from './Divider';

const address = css`
  margin-left: 1em;
  padding-left: 1em;
  font-style: normal;
  border-left: 1px dotted #ccc;
`;

const note = css`
  font-style: italic;
`;

type Props = {|
  document: Document,
|};

export default ({ document }: Props) => (
  <div>
    <PageTitle>Order softcover: {document.title}</PageTitle>
    <ByLine>
      by <a href={url(document.friend)}>{document.friend.name}</a>
    </ByLine>
    <p>
      {/* eslint-disable max-len */}
      To purchase a print edition, please send a check made out to <i>Market Street Fellowship</i> at the following address:
      {/* eslint-enable max-len */}
    </p>
    <address className={address}>
      Friends Library Books<br />
      981 W. Market Street<br />
      Akron, OH 44313<br />
      USA
    </address>
    <p>
      {/* eslint-disable max-len */}
      All printed editions are softcover, and cost $6 USD each.  Please add an additional $5 USD (per order) for shipping addresses outside of the United States.
      {/* eslint-enable max-len */}
    </p>
    <p className={note}>
      {/* eslint-disable max-len */}
      * Be sure to clearly indicate the book title, quantity desired, your shipping address, and a phone number or email address where we can reach you if there is a problem.
      {/* eslint-enable max-len */}
    </p>
    <Divider />
    <p>
      {/* eslint-disable max-len */}
      Online ordering and acceptance of credit card payments is coming soon -- thanks for your patience. Questions about printed books and ordering can be directed to <a href="mailto:MSFPrinting@gmail.com">MSFPrinting@gmail.com</a>.
      {/* eslint-enable max-len */}
    </p>
  </div>
);
