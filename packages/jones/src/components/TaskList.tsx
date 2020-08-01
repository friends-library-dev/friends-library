import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import { Task as TaskType, State } from '../type';
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

interface Props {
  tasks: TaskType[];
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <List>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </List>
  );
};

const mapState = (state: State): Props => ({
  tasks: Object.values(state.tasks.present),
});

export default connect(mapState)(TaskList);
