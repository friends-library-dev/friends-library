// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { changeScreen, createTask } from '../actions';
import * as screens from '../screens';
import Button from './Button';
import Heading from './Heading';
import TaskList from './TaskList';

const Welcome = ({ tasks, changeScreen, createTask }) => (
  <div>
    <h1>Welcome!</h1>
    <Heading>You have {tasks.length} task{tasks.length === 1 ? '' : 's'}:</Heading>
    <TaskList />
    <Button onClick={() => {
      createTask({ taskId: uuid.v4() });
      changeScreen(screens.EDIT_TASK);
    }}>Create a task</Button>
  </div>
);

const mapState = state => ({
  tasks: state.tasks,
});

const mapDispatch = {
  changeScreen,
  createTask,
};

export default connect(mapState, mapDispatch)(Welcome);
