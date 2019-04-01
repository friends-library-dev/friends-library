import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import { Task, Dispatch, State as AppState } from '../type';
import { requireCurrentTask } from '../select';
import * as actions from '../actions';
import * as screens from '../screens';
import Button from './Button';
import Heading from './Heading';
import Loading from './Loading';

const FriendList = styled.ul`
  margin: 0;
  padding: 0;
  column-width: 140px;
  column-gap: 7px;

  & li {
    list-style-type: none;
    break-inside: avoid-column;
    background: gray;
    margin-bottom: 7px;
    padding: 5px 7px;
    cursor: pointer;
    font-size: 12px;

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
  height: 100px;
  display: flex;
  width: 100%;
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

type Props = {
  friends: Array<{
    name: string;
    repoId: number;
    slug: string;
  }>;
  task: Task;
  updateTask: Dispatch;
  goToTasks: Dispatch;
  deleteTask: Dispatch;
  fetchFriendRepos: Dispatch;
};

type State = {
  name: string;
  repoId: number | null;
};

class EditTask extends React.Component<Props, State> {
  private input = React.createRef<HTMLInputElement>();

  public constructor(props: Props) {
    super(props);
    this.state = {
      name: props.task.name,
      repoId: props.task.repoId,
    };
  }

  public componentDidMount() {
    const { fetchFriendRepos, friends } = this.props;
    // re-fetch friend repos once per session to add new friends
    if (!friendsFetchedThisSession || friends.length === 0) {
      fetchFriendRepos();
      friendsFetchedThisSession = true;
    }

    this.input.current && this.input.current.focus();
  }

  protected clickSave = () => {
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
  };

  protected clickCancel = () => {
    const { deleteTask, goToTasks, task } = this.props;
    if (task.isNew) {
      deleteTask(task.id);
    }
    goToTasks();
  };

  public render() {
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            this.setState({ name: e.target.value })
          }
        />
        <Heading>Choose a Friend:</Heading>
        {friends.length === 0 ? (
          <Loading />
        ) : (
          <FriendList>
            {friends
              .sort((a, b) => (a.name < b.name ? -1 : 1))
              .map(friend => (
                <li
                  key={friend.repoId}
                  className={repoId === friend.repoId ? 'selected' : ''}
                  onClick={() => this.setState({ repoId: friend.repoId })}
                >
                  {friend.name}
                </li>
              ))}
          </FriendList>
        )}
        <Btns>
          <Button height={50} secondary onClick={this.clickCancel}>
            Cancel
          </Button>
          <Button
            height={50}
            disabled={repoId === -1 || !name.trim()}
            onClick={this.clickSave}
          >
            Save
          </Button>
        </Btns>
      </div>
    );
  }
}

const mapState = (state: AppState) => ({
  friends: state.repos.map(r => ({
    repoId: r.id,
    name: r.friendName,
    slug: r.slug,
  })),
  task: requireCurrentTask(state),
});

const mapDispatch = {
  fetchFriendRepos: actions.fetchFriendRepos,
  updateTask: actions.updateTask,
  goToTasks: () => actions.changeScreen(screens.TASKS),
  deleteTask: actions.deleteTask,
};

export default connect(
  mapState,
  mapDispatch,
)(EditTask);
