// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { changeScreen, createTask } from '../actions';
import * as screens from '../screens';

const Welcome = ({ tasks, changeScreen, createTask }) => (
  <div>
    <h1>Welcome!</h1>
    <p>You have {tasks.length} tasks!</p>
    <button onClick={() => {
      const taskId = uuid.v4();
      createTask({ taskId });
      changeScreen(screens.EDIT_TASK);
    }}>Create a task</button>
  </div>
);

const mapState = state => ({
  tasks: state.tasks,
  currentTask: state.currentTask,
});

const mapDispatch = {
  changeScreen,
  createTask,
};

export default connect(mapState, mapDispatch)(Welcome);
