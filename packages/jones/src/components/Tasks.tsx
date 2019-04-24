import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { Task, Dispatch, State } from '../type';
import * as actions from '../actions';
import * as screens from '../screens';
import Button from './Button';
import Heading from './Heading';
import TaskList from './TaskList';

interface Props {
  tasks: Task[];
  changeScreen: Dispatch;
  createTask: Dispatch;
}

const Welcome: React.SFC<Props> = ({ tasks, changeScreen, createTask }) => (
  <div className="padded-wrap">
    <h1>Tasks</h1>
    <Heading>
      You have {tasks.length} task{tasks.length === 1 ? '' : 's'}:
    </Heading>
    <TaskList />
    <Button
      onClick={() => {
        createTask({ taskId: uuid() });
        changeScreen(screens.EDIT_TASK);
      }}
    >
      Create a task
    </Button>
  </div>
);

const mapState = (state: State): Pick<Props, 'tasks'> => ({
  tasks: Object.values(state.tasks.present),
});

const mapDispatch = {
  changeScreen: actions.changeScreen,
  createTask: actions.createTask,
};

export default connect(
  mapState,
  mapDispatch,
)(Welcome);
