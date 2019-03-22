// @flow
import * as React from 'react';
import { Section, H1, Para } from '../components';

export default () => (
  <Section id="videos">
    <H1>Videos</H1>
    <Para>
      Below is a list of rough instructional videos on asciidoc and using the online
      editor:
    </Para>
    <ul>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-01-28_10-47-19.mp4">
          Communicating with Github comments
        </a>{' '}
        (4m)
      </li>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-01-28_10-59-53.mp4">
          Finding stuff in source documents
        </a>{' '}
        (6m)
      </li>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-01-31_15-34-04.mp4">
          Workflow tips and gotchas
        </a>{' '}
        (12m)
      </li>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-02-07_16-09-44.mp4">
          Italics and snippets
        </a>{' '}
        (5m)
      </li>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-03-04_08-56-30.mp4">
          Github and pull requests
        </a>{' '}
        (13m)
      </li>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-03-12_17-38-55.mp4">
          All about the "linter"
        </a>{' '}
        (21m)
      </li>
      <li>
        <a href="http://screenshots.pro.photo/jared/2019-03-20_09-06-34.mp4">
          Avoiding problems with comments
        </a>{' '}
        (3m)
      </li>

      <li>
        <a href="http://screenshots.pro.photo/jared/2019-03-22_11-02-00.mp4">
          All about "intake"
        </a>{' '}
        (29m)
      </li>
    </ul>
  </Section>
);
