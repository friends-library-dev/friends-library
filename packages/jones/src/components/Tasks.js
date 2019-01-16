// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import type { Task, Dispatch } from '../type';
import * as actions from '../actions';
import * as screens from '../screens';
import Button from './Button';
import Heading from './Heading';
import TaskList from './TaskList';

type Props = {|
  tasks: Array<Task>,
  changeScreen: Dispatch,
  createTask: Dispatch,
|};

const Welcome = ({ tasks, changeScreen, createTask }: Props) => (
  <div className="padded-wrap">
    <h1>Tasks</h1>
    <Heading>You have {tasks.length} task{tasks.length === 1 ? '' : 's'}:</Heading>
    <TaskList />
    <Button onClick={() => {
      createTask({ taskId: uuid() });
      changeScreen(screens.EDIT_TASK);
    }}
    >Create a task
    </Button>
  </div>
);

const mapState = state => ({
  tasks: Object.values(state.tasks),
});

const mapDispatch = {
  changeScreen: actions.changeScreen,
  createTask: actions.createTask,
};

export default connect(mapState, mapDispatch)(Welcome);
