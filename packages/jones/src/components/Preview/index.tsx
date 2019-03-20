import React from 'react';
import { connect } from 'react-redux';
import { Uuid } from '@friends-library/types';
import { State } from '../../type';
import chapterJob from '../../lib/chapter-job';

type OwnProps = {
  taskId: Uuid;
  file: string;
};

type Props = {
  friendName: string;
};

const Component: React.SFC<Props> = props => <h1>{props.friendName}</h1>;

const mapState = (state: State, { taskId, file }: OwnProps): Props => {
  chapterJob(state, taskId, file);
  return {
    friendName: 'my friend!',
  };
};

export default connect(mapState)(Component);
