// @flow
import * as React from 'react';
import { Link, graphql } from 'gatsby';
import type { Slug } from '../../../../type';
import { Layout, Block, PageTitle, Divider, Button } from '../components';

type Props = {
  data: {|
    allFriend: {|
      edges: Array<{|
        node: {|
          slug: Slug,
        |}
      |}>
    |},
  |},
}

export default ({ data: { allFriend: { edges } } }: Props) => (
  <Layout>
    <Block>
      <PageTitle>Explore Books</PageTitle>

      <p><i>[This page is meant to help someone get a birds-eye view of the books on the site and how they might find them. This will probably include listing/sorting by various attributes, like author, whether it has a modernized or audio version, by genre/tag/whatever, search, etc. Like the /getting-started page, this is a pretty important page that will likely need lots of iterations to get right, and will hopefully always be in a state of slow, incremental improvement.  NOTE: not all the links on this page work, some of them are for quasi-features that I don't know if we even want, so I left them as non-working links.]</i></p>

      <Divider />

      <h2>Explore by Author</h2>

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <ul>
        <li><Link to="/friend/george-fox">George Fox</Link></li>
        <li><Link to="/friend/isaac-penington">Isaac Penington</Link></li>
        <li><Link to="/friend/sarah-grubb">Sarah Grubb</Link></li>
        <li><Link to="/friend/robert-barclay">Robert Barclay</Link></li>
      </ul>

      <Button url="/friends" text={`See all ${edges.length} friends »`} />

      <Divider />

      <h2>Explore by Genre</h2>

      <p>For those times when you really want to go genre by genre.</p>

      <ul>
        <li><Link to="/genre/journal">Journals (57)</Link></li>
        <li><Link to="/genre/devotional">Devotional (7)</Link></li>
        <li><Link to="/genre/history">History (6)</Link></li>
        <li><Link to="/genre/doctrinal">Doctrine (11)</Link></li>
        <li><Link to="/genre/letters">Letters (43)</Link></li>
      </ul>

      <Divider />

      <h2>Explore by Time Period</h2>

      <p>All the writings on this site are from the <i>early</i> members of the Religious Society of Friends -- none are from modern times whatsoever. However, the early period between 1640 and 1880 can be further sub-divided:</p>

      <ul>
        <li><Link to="/period/early">Early (1640 - 1720)</Link></li>
        <li><Link to="/period/mid">Mid (1720 - 1800)</Link></li>
        <li><Link to="/period/late">Late (1800 - 1880)</Link></li>
      </ul>

      <Divider />

      <h2>Explore by Format/Edition</h2>

      <p>Not all the books on this site are available in all formats or editions. In particular, we find many people are most interested in our <i>updated</i> editions and in books that have been converted into <i>audiobooks</i>.</p>

      <ul>
        <li><Link to="/audiobooks">Audiobooks</Link></li>
        <li><Link to="/updated">Updated editions</Link></li>
      </ul>

      <Divider />

      <h2>Recommendations</h2>

      <p>We also have a number of carefully selected recommendations for new readers on our <Link to="/getting-started">Getting Started</Link> page, so you if you haven't looked at those, that's a great place to start.</p>

      <Button url="/getting-started" text="Getting Started »" />

    </Block>
  </Layout>
);

export const query = graphql`
  query {
    allFriend {
      edges {
        node {
          slug
        }
      }
    }
  }
`;
