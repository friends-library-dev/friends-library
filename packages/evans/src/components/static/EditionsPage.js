// @flow
import * as React from 'react';
import Block from '../Block';
import PageTitle from '../PageTitle';
import Divider from '../Divider';
import { original, modernized, updated } from '../descriptions';

export default () => (
  <Block>
    <PageTitle>About Book Editions</PageTitle>

    <p><i>[This page will have the main explanations for the three "tiers" of editions, to inform and satisfy the confused or interested user. We also might link directly to the sub-sections from tool-tips whenever we indicate a books edition, or maybe embed the same descriptions in the tooltip?  The current blurbs below are far from sufficient, they would need to be substantially improved and expanded.]</i></p>

    <Divider />

    <h2>Original Editions</h2>

    <p dangerouslySetInnerHTML={{ __html: original }} />

    <h2>Modernized Editions</h2>

    <p dangerouslySetInnerHTML={{ __html: modernized }} />

    <h2>Updated Editions</h2>

    <p dangerouslySetInnerHTML={{ __html: updated }} />

  </Block>
);
