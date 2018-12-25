// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Friend, Task, Dispatch } from '../redux/type';
import { values } from './utils';
import { updateTask, changeScreen, deleteTask } from '../redux/actions';
import * as screens from '../redux/screens';
import Button from './Button';
import Heading from './Heading';

const FriendList = styled.ul`
  margin: 0 0 50px 0;
  padding: 0;
  & li {
    display: inline-block;
    width: 160px;
    height: 28px;
    text-align: center;
    background: gray;
    margin: 5px;
    padding-top: 9px;
    cursor: pointer;

    &:hover {
      background: #444;
    }

    &.selected {
      background: #61afef;
      color: black;
      cursor: default;
    }
  }
`;

const Input = styled.input`
  background: gray;
  border: none;
  color: #ddd;
  padding: 5px 10px;
  font-size: 25px;
  width: 500px;
`;

type Props = {|
  friends: Array<Friend>,
  task: Task,
  updateTask: Dispatch,
  goToWelcome: Dispatch,
  deleteTask: Dispatch,
|};

type State = {|
  name: string,
  repo: string,
|};

class EditTask extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      name: props.task.name,
      repo: props.task.repo,
    };
  }

  clickSave = () => {
    const { name, repo } = this.state;
    const { updateTask, goToWelcome, task } = this.props;
    if (!repo || !name.trim()) {
      return;
    }
    updateTask({
      id: task.id,
      data: { name, repo, isNew: false }
    });
    goToWelcome();
  }

  clickCancel = () => {
    const { deleteTask, goToWelcome, task } = this.props;
    if (task.isNew) {
      deleteTask(task.id);
    }
    goToWelcome();
  }

  render() {
    const { name, repo } = this.state;
    const { task, friends } = this.props;
    return (
      <div>
        <h1>{task.isNew ? 'Create' : 'Edit'} Task:</h1>
        <Heading>Task Name:</Heading>
        <Input
          type="text"
          value={name}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <Heading>Friend:</Heading>
        <FriendList>
          {friends.map(friend => (
            <li
              key={friend.slug}
              className={repo === friend.slug ? 'selected' : ''}
              onClick={() => this.setState({ repo: friend.slug })}
            >
              {friend.name}
            </li>
          ))}
        </FriendList>
        <Button secondary={true} onClick={this.clickCancel}>
          Cancel
        </Button>
        <Button disabled={!repo || !name.trim()} onClick={this.clickSave}>
          Save
        </Button>
      </div>
    )
  }
}

const mapState = state => ({
  friends: values(state.friends),
  task: state.tasks[state.currentTask],
});

const mapDispatch = {
  updateTask,
  goToWelcome: () => changeScreen(screens.WELCOME),
  deleteTask,
};

export default connect(mapState, mapDispatch)(EditTask);
