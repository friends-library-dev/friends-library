// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { currentTask } from '../select';
import * as actions from '../actions';
import Button from './Button';
import WorkNav from './WorkNav';

export default ({ screen }) => (
  <>
    {screen !== 'WORK'
      ? <>Friends Library Publishing <i>Online Editor</i></>
      : <WorkNav />
    }
  </>
);
