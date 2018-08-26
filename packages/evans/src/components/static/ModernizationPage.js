// @flow
import * as React from 'react';
import { css } from 'glamor';
import Block from '../Block';
import PageTitle from '../PageTitle';
import Content from '../Content';

const element = css`
  & dl {
    margin-left: 1.5em;
  }
  & dt:before {
    content: " ";
    white-space: pre-wrap;
    display: block;
    height: .5em;
  }
  & dt {
    font-weight: 700;
    display: inline;
    margin: 0;
    width: 50px;
  }
  & dt:after {
    content: " - ";
    font-weight: 400;
  }
  & dd {
    display: inline;
    margin: 0;
  }
`;

export default () => (
  <Block className={element}>
    <PageTitle>Modernization</PageTitle>
    <Content file="modernization" />
  </Block>
);
