// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Task as TaskType } from '../redux/type';
import Task from './Task';

const List = styled.ul`
  margin: 45px 0;
  padding: 0;
`;

type Props = {|
  tasks: Array<TaskType>,
|};

const TaskList = ({ tasks }: Props) => {
  return (
    <List>
      {tasks.map(task => <Task key={task.id} task={task} />)}
    </List>
  );
};

const mapState = state => ({
  tasks: Object.values(state.tasks),
});

export default connect(mapState)(TaskList);
