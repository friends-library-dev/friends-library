// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import moment from 'moment';
import smalltalk from 'smalltalk';
import * as actions from '../redux/actions';
import type { Task as TaskType, Friend, Dispatch } from '../redux/type';
import { callMain, ipcRenderer as ipc } from '../webpack-electron';
import Button from './Button';

const Wrap = styled.li`
  background: #999;
  color: #222;
  border-radius: 3px;
  box-shadow: 3px 6px 9px black;
  display: inline-block;
  width: 450px;
  list-style: none;
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 14px 21px;
  cursor: pointer;

  & h1 {
    font-size: 25px;
    background: #121212;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    color: white;
    margin: -14px -21px 12px -21px;
    padding: 16px;
  }

  & p {
    font-size: 19px;
    padding-left: 20px;
    color: #333;
  }

  & .create-pr-msg {
    padding-left: 0;
    font-style: italic;
  }

  & i {
    padding-right: 0.4em;
  }

  & .actions {
    margin-bottom: 10px;

    & .delete, & .work {
      margin-left: 50px;
    }

    & .delete {
      color: red;
    }

    & > * {
      border-radius: 3px;
      display: inline-block;
      width: 200px;
      margin-right: 0;
      margin-top: 10px;
      background: #eaeaea;
    }

    & > .work {
      background: var(--accent);
      color: white;
    }

    & > .invisible {
      opacity: 0;
      cursor: default;
    }
  }

  & .time {
    list-style: none;
    color: white;
    opacity: 0.5;
    margin-bottom: 20px;
    padding-left: 20px;
    line-height: 150%;
  }
`;

type Props = {|
  task: TaskType,
  friend: Friend,
  workOnTask: Dispatch,
  deleteTask: Dispatch,
  updateTask: Dispatch,
|};

type State = {|
  submitting: boolean,
  gitPushing: boolean,
|};


class Task extends React.Component<Props, State> {
  state = {
    submitting: false,
    gitPushing: false,
  };

  submit = async () => {
    const { task } = this.props;
    this.setState({ submitting: !task.prNumber, gitPushing: true });
    await callMain('git:push', task);
    this.setState({ gitPushing: false });
  }

  prText() {
    if (this.prNeedsCreation()) {
      return 'Create Pull Request';
    }
    return 'View Pull Request';
  }

  pr = () => {
    const { task: { repo, id, name, prNumber } } = this.props;
    const repoUrl = `http://github.com/friends-library/${repo}`;

    if (this.prNeedsCreation()) {
      const title = encodeURIComponent(name);
      const url = `${repoUrl}/compare/task-${id}?expand=1&title=${title}`;
      ipc.send('open:url', url);
      this.startPoll();
      return;
    }

    const url = `${repoUrl}/pull/${prNumber || ''}`;
    ipc.send('open:url', url);
  }

  startPoll() {
    const { task: { repo, id }, updateTask } = this.props;
    // unscoped token, no privileges, read-only to public info, so ¯\_(ツ)_/¯
    const token = '?access_token=bc14d218db2e8a03d5c209c159bc29d7cf02e8c3';
    const url = `https://api.github.com/repos/friends-library/${repo}/pulls${token}`;
    const interval = setInterval(() => {
      fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'If-None-Match': '', // https://github.com/octokit/rest.js/issues/890#issuecomment-392193948
        },
      })
        .then(res => res.json())
        .then(prs => {
          prs.forEach(pr => {
            if (pr.head.ref === `task-${id}`) {
              updateTask({ id, data: { prNumber: pr.number } });
              this.setState({ submitting: false });
              clearInterval(interval);
            }
          });
        });
    }, 4000);
  }

  submitText() {
    const { submitting, gitPushing } = this.state;
    const { task: { prNumber } } = this.props;
    if (gitPushing) {
      return 'Sending files...';
    }
    if (submitting) {
      return 'Waiting...';
    }
    if (prNumber) {
      return 'Re-submit';
    }
    return 'Submit';
  }

  confirmDelete = () => {
    const msg = 'You will lose any work and there is no undo.\nPlease type "Hubberthorne" to confirm:\n\n';
    smalltalk
      .prompt('Delete Task?', msg)
      .then((value) => {
        if (value === 'Hubberthorne') {
          this.deleteTask();
        }
      }).catch(() => {});
  }

  deleteTask() {
    const { task, deleteTask } = this.props;
    deleteTask(task.id);
    ipc.send('delete:task-branch', task);
  }

  prNeedsCreation() {
    const { task } = this.props;
    return !task.prNumber;
  }

  render() {
    const { submitting, gitPushing } = this.state;
    const { task, friend, workOnTask } = this.props;
    if (!friend) {
      return null;
    }

    return (
      <Wrap>

        <h1>
          <i className="fas fa-code-branch" />
          {task.name}
        </h1>

        <p>
          <i className={`fas fa-${friend.gender}`} />
          Friend: <em>{friend.name}</em>
        </p>

        <ul className="time">
          <li>
            <i className="far fa-calendar" />
            <i>Created:</i>{moment(task.created).format('D/M/YY [at] h:mm:ssa')}
          </li>
          <li>
            <i className="far fa-calendar" />
            <i>Last updated:</i>{moment(task.updated).from(moment())}
          </li>
        </ul>

        {(submitting && !gitPushing && !task.prNumber) && (
          <p className="create-pr-msg">
            Click the "Create Pull Request" button below and then
            click the green "Create Pull Request" button on Github
            to finalize submission of this task.
          </p>
        )}

        <div className="actions">

          {((submitting && !gitPushing) || task.prNumber)
            ? (
              <Button secondary onClick={this.pr} className="pr">
                <i className="fas fa-code-branch" />
                {this.prText()}
              </Button>
            )
            : <Button className="invisible">¯\_(ツ)_/¯</Button>
          }

          <Button
            secondary
            className="delete"
            onClick={this.confirmDelete}
          >
            <i className="far fa-trash-alt" />
            Delete
          </Button>

          <Button
            secondary
            className="submit"
            onClick={this.submit}
          >
            <i className="fas fa-cloud-upload-alt" />
            {this.submitText()}
          </Button>

          <Button
            className="work"
            onClick={() => workOnTask(task.id)}
          >
            <i className="fas fa-pencil-alt" />
            Work
          </Button>
        </div>
      </Wrap>
    );
  }
}

const mapState = (state, { task }) => ({
  friend: state.friends[`en/${task.repo}`],
  task,
});

const mapDispatch = {
  workOnTask: actions.workOnTask,
  updateTask: actions.updateTask,
  deleteTask: actions.deleteTask,
};

export default connect(mapState, mapDispatch)(Task);
