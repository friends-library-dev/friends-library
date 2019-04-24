import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import { Block, Layout, PageTitle, Divider, EmbeddedAudio } from '../components';

const featured = css`
  background: #eaeaea;
  padding: 1px 0.6em 0.5em 0.85em;
  margin-bottom: 1em;
  border-radius: 5px;

  > h2 {
    font-size: 16px;
    font-style: italic;
    margin: 10px 0 0;
  }

  > p {
    line-height: 1.3em;
    font-size: 0.9em;
    margin-top: 8px;
  }
`;

export default () => (
  <Layout>
    <Block>
      <PageTitle>Getting Started</PageTitle>

      <p>
        <i>
          [This page will have the carefully thought-through, curated paths for new people
          to use in exploring the books on the site. This is probably a page that we will
          want to iterate on extensively and keep honing for quite a while. It might also
          be one that is in a continual state of slow change as new documents are added
          and we get more experience recommending books to new folks. The book choices,
          order, are all meant to be not much more than glorified placeholders.]
        </i>
      </p>

      <Divider />

      <p>
        First, if you haven't listened to our introductory audio explaining who the early
        Quakers were, we recommend you start there by clicking the play button below:
      </p>

      <EmbeddedAudio id={242345955} title="Introduction to the Early Quakers" />

      <p>
        Next, scan the sections below to see which one feels like the best match for what
        you're interested in reading first.
      </p>

      <Divider />

      <h2>History</h2>

      <p>
        <i>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </i>
      </p>

      <div css={featured}>
        <h2>1. William Penn: Primitive Christianity Revived</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/william-penn/primitive-christianity-revived">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>2. Mary Ann Kelty: Lives and Persecutions</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/william-penn/primitive-christianity-revived">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>3. William Sewell: History of the Quakers</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/william-sewel/history-of-quakers">Read now &raquo;</Link>
        </p>
      </div>

      <Divider />

      <h2>Doctrine</h2>

      <p>
        <i>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </i>
      </p>

      <div css={featured}>
        <h2>1. Robert Barclay: Saved to the Uttermost</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/robert-barclay/saved-to-the-uttermost">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>2. Joseph Phipps: Original and Present State</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/joseph-phipps/original-and-present-state-of-man">
            Read now &raquo;
          </Link>
        </p>
      </div>

      <div css={featured}>
        <h2>3. William Penn: No Cross, No Crown</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/william-penn/no-cross-no-crown">Read now &raquo;</Link>
        </p>
      </div>

      <Divider />

      <h2>Devotional</h2>

      <p>
        <i>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </i>
      </p>

      <div css={featured}>
        <h2>1. Isaac Penington: Writings, volume 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/isaac-penington/writings-volume-1">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>2. William Shewen: Meditations &amp; Experiences</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/william-shewen/meditations-experiences">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>3. Isaac Penington: Writings, volume 2</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/isaac-penington/writings-volume-2">Read now &raquo;</Link>
        </p>
      </div>

      <Divider />

      <h2>Journals</h2>

      <p>
        <i>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </i>
      </p>

      <div css={featured}>
        <h2>1. Journal of John Richardson</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/john-richardson/journal">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>2. Life and Letters of Rebecca Jones</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/rebecca-jones/life-letters">Read now &raquo;</Link>
        </p>
      </div>

      <div css={featured}>
        <h2>3. The Life of Thomas Ellwood</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
          <Link to="/thomas-ellwood/life">Read now &raquo;</Link>
        </p>
      </div>
    </Block>
  </Layout>
);
