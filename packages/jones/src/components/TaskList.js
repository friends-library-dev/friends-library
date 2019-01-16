// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Task as TaskType } from '../type';
import Task from './Task';

const List = styled.ul`
  margin: 30px -15px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > li {
    flex-basis: 480px;
    margin: 15px;
  }
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
