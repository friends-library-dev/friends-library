// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import type { Task, Dispatch } from '../type';
import * as actions from '../actions';
import * as screens from '../screens';
import Button from './Button';
import Heading from './Heading';
import Loading from './Loading';

const FriendList = styled.ul`
  margin: 0 0 50px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: calc(100vh - 400px);
  align-content: flex-start;
  overflow: auto;
  min-height: 0;

  & li {
    list-style-type: none;
    flex-shrink: 0;
    min-width: 120px;
    height: 32px;
    background: gray;
    margin: 5px;
    padding: 7px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: #444;
    }

    &.selected {
      background: var(--accent);
      color: black;
      cursor: default;
    }
  }
`;

const Btns = styled.div`
  position: fixed;
  height: 100px;
  display: flex;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-left: 35px;
  align-items: center;

  > * {
    margin-right: 30px;
  }
`;

const H1 = styled.h1`
  > i {
    color: var(--accent);
    padding-right: 0.35em;
    font-size: 0.85em;
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

let friendsFetchedThisSession = false;

type Props = {|
  friends: Array<*>,
  task: Task,
  updateTask: Dispatch,
  goToTasks: Dispatch,
  deleteTask: Dispatch,
  fetchFriendRepos: Dispatch,
|};

type State = {|
  name: string,
  repoId: number,
|};

class EditTask extends React.Component<Props, State> {
  input: any

  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      name: props.task.name,
      repoId: props.task.repoId,
    };
  }

  componentDidMount() {
    const { fetchFriendRepos, friends } = this.props;
    // re-fetch friend repos once per session to add new friends
    if (!friendsFetchedThisSession || friends.length === 0) {
      fetchFriendRepos();
      friendsFetchedThisSession = true;
    }
    this.input.current.focus();
  }

  clickSave = () => {
    const { name, repoId } = this.state;
    const { updateTask, goToTasks, task } = this.props;
    if (!repoId || !name.trim()) {
      return;
    }
    updateTask({
      id: task.id,
      data: { name, repoId, isNew: false },
    });
    goToTasks();
  }

  clickCancel = () => {
    const { deleteTask, goToTasks, task } = this.props;
    if (task.isNew) {
      deleteTask(task.id);
    }
    goToTasks();
  }

  render() {
    const { name, repoId } = this.state;
    const { task, friends } = this.props;
    return (
      <div className="padded-wrap">
        <H1>
          <i className="fas fa-code-branch" />
          {task.isNew ? 'Create' : 'Edit'} Task
        </H1>
        <Heading>Task name:</Heading>
        <Input
          ref={this.input}
          type="text"
          value={name}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <Heading>Choose a Friend:</Heading>
        {friends.length === 0
          ? <Loading />
          : (
              <FriendList>
                {friends.sort((a, b) => (a.name < b.name ? -1 : 1)).map(friend => (
                  <li
                    key={friend.repoId}
                    className={repoId === friend.repoId ? 'selected' : ''}
                    onClick={() => this.setState({ repoId: friend.repoId })}
                  >
                    {friend.name}
                  </li>
                ))}
              </FriendList>
            )
          }
        <Btns>
          <Button height={50} secondary onClick={this.clickCancel}>
            Cancel
          </Button>
          <Button height={50} disabled={!repoId || !name.trim()} onClick={this.clickSave}>
            Save
          </Button>
        </Btns>
      </div>
    );
  }
}

const mapState = state => ({
  friends: state.repos.map(r => ({
    repoId: r.id,
    name: r.friendName,
    slug: r.slug,
  })),
  task: state.tasks[state.currentTask],
});

const mapDispatch = {
  fetchFriendRepos: actions.fetchFriendRepos,
  updateTask: actions.updateTask,
  goToTasks: () => actions.changeScreen(screens.TASKS),
  deleteTask: actions.deleteTask,
};

export default connect(mapState, mapDispatch)(EditTask);
