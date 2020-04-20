import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import moment from 'moment';
import uuid from 'uuid/v4';
import smalltalk from 'smalltalk';
import * as actions from '../actions';
import { Task as TaskType, Dispatch, Repo, State as AppState } from '../type';
import Button from './Button';
import { ORG } from '../lib/github-api';

const Wrap = styled.li<{ locked: boolean }>`
  background: #999;
  color: #222;
  border-radius: 3px;
  box-shadow: 3px 6px 9px black;
  display: inline-block;
  list-style: none;
  margin-bottom: 35px;
  padding: 14px 21px;

  & h1 {
    font-size: 20px;
    background: ${(p: any) => (p.locked ? '#5d0303' : '#121212')};
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    color: #ddd;
    margin: -14px -21px 12px -21px;
    padding: 16px;
  }

  & p.friend {
    font-weight: 700;
    font-size: 17px;
    color: #333;
  }

  & i {
    padding-right: 0.4em;
  }

  & .actions {
    margin-bottom: 10px;

    & .delete,
    & .work {
      margin-left: 50px;
    }

    .reopen {
      color: red;
    }

    & .delete {
      color: ${(p: any) => (p.locked ? 'white' : 'red')};
      background: ${(p: any) => (p.locked ? 'var(--accent)' : '#eaeaea')};
    }

    & > * {
      border-radius: 3px;
      display: inline-block;
      width: 190px;
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

interface OwnProps {
  task: TaskType;
}

type Props = OwnProps & {
  repo: Repo;
  taskHasWork: boolean;
  resubmit: Dispatch;
  submit: Dispatch;
  workOnTask: Dispatch;
  deleteTask: Dispatch;
  updateTask: Dispatch;
  reopenTask: Dispatch;
  syncStatus: Dispatch;
};

interface State {
  submitting: boolean;
}

class Task extends React.Component<Props, State> {
  public state = {
    submitting: false,
  };

  public async componentDidMount(): Promise<void> {
    const { task, syncStatus } = this.props;
    task.pullRequest && syncStatus(task);
  }

  protected confirmDelete: () => void = () => {
    if (process.env.NODE_ENV === 'development') {
      this.deleteTask();
      return;
    }

    smalltalk
      .prompt(
        'Delete Task?',
        'You will lose any work and there is no undo.\nPlease type "Hubberthorne" to confirm:\n\n',
      )
      .then((value: string) => {
        if (value === 'Hubberthorne') {
          this.deleteTask();
        }
      })
      .catch(() => {});
  };

  protected deleteTask: () => void = () => {
    const { task, deleteTask } = this.props;
    deleteTask(task.id);
  };

  protected submit: () => Promise<void> = async () => {
    const { task, submit } = this.props;
    this.setState({ submitting: true });
    await submit(task);
    this.setState({ submitting: false });
  };

  protected resubmit: () => Promise<void> = async () => {
    const { task, resubmit } = this.props;
    this.setState({ submitting: true });
    await resubmit(task);
    this.setState({ submitting: false });
  };

  protected reopen: () => void = () => {
    const { task, reopenTask } = this.props;
    smalltalk
      .confirm(
        'Reopen?',
        'Reopening should only be done when you need to re-submit a task that has accidentally been worked on after the PR has been merged.',
        { buttons: { ok: 'Recover', cancel: 'Cancel' } },
      )
      .then(() => reopenTask({ id: task.id, newId: uuid() }))
      .catch(() => {});
  };

  protected submitText(): string {
    const {
      task: { pullRequest },
    } = this.props;
    const { submitting } = this.state;
    if (submitting) {
      return 'Submitting...';
    }
    return pullRequest ? 'Re-submit' : 'Submit';
  }

  public render(): JSX.Element {
    const { submitting } = this.state;
    const { task, repo, workOnTask, taskHasWork } = this.props;
    let status = 'open';
    if (task.pullRequest && task.pullRequest.status) {
      status = task.pullRequest.status;
    }
    const isLocked = status !== 'open';
    return (
      <Wrap locked={isLocked}>
        <h1>
          <i className={`fas fa-${isLocked ? 'lock' : 'code-branch'}`} />{' '}
          {isLocked ? `${status.toUpperCase()}: ` : ''}
          {task.name}
        </h1>
        <p className="friend">
          Friend: <em>{repo.friendName}</em>
        </p>
        {!isLocked && (
          <ul className="time">
            <li>
              <i className="far fa-calendar" />
              <i>Created:</i>
              {moment(task.created).format('M/D/YY [at] h:mm:ssa')}
            </li>
            <li>
              <i className="far fa-calendar" />
              <i>Last updated:</i>
              {moment(task.updated).from(moment())}
            </li>
          </ul>
        )}
        <div className="actions">
          {task.pullRequest ? (
            <Button
              secondary
              target="_blank"
              href={`https://github.com/${ORG}/${repo.slug}/pull/${task.pullRequest.number}`}
              className="pr"
            >
              <i className="fas fa-code-branch" />
              View pull request
            </Button>
          ) : (
            <Button className="invisible">¯\_(ツ)_/¯</Button>
          )}
          <Button
            secondary={!isLocked}
            className="delete"
            onClick={isLocked ? this.deleteTask : this.confirmDelete}
          >
            <i className="far fa-trash-alt" />
            Delete
          </Button>
          {!isLocked && (
            <Button
              secondary
              disabled={!taskHasWork || submitting}
              className="submit"
              onClick={task.pullRequest ? this.resubmit : this.submit}
            >
              <i className="fas fa-cloud-upload-alt" />
              {this.submitText()}
            </Button>
          )}
          {isLocked && (
            <Button secondary className="reopen" onClick={this.reopen}>
              <i className="fas fa-redo-alt" />
              Reopen
            </Button>
          )}
          {!isLocked && (
            <Button className="work" onClick={() => workOnTask(task.id)}>
              <i className="fas fa-pencil-alt" />
              Work
            </Button>
          )}
        </div>
      </Wrap>
    );
  }
}

const mapState = (
  state: AppState,
  { task }: OwnProps,
): Pick<Props, 'task' | 'repo' | 'taskHasWork'> => {
  const repo = state.repos.find(r => r.id === task.repoId);
  if (!repo) {
    throw new Error(`Could not find repo with id ${task.repoId}`);
  }
  return {
    task,
    repo,
    taskHasWork: !!Object.values(task.files).find(f => !!f.editedContent),
  };
};

const mapDispatch = {
  submit: actions.submitTask,
  resubmit: actions.resubmitTask,
  workOnTask: actions.workOnTask,
  updateTask: actions.updateTask,
  deleteTask: actions.deleteTask,
  reopenTask: actions.reopenTask,
  syncStatus: actions.syncPullRequestStatus,
};

export default connect(mapState, mapDispatch)(Task);
