import * as React from 'react';
import { connect, Omit } from 'react-redux';
import styled from '@emotion/styled/macro';
import { State as AppState, Task, Dispatch } from '../type';
import { requireCurrentTask, currentTaskFriendName } from '../select';
import * as actions from '../actions';
import Button from './Button';

const Wrap = styled.nav`
  display: flex;

  .to-tasks {
    width: 150px;
  }

  > .task {
    padding-left: 1em;
    flex-grow: 1;

    > .fa-code-branch {
      color: var(--accent);
      padding-right: 0.4em;
    }
  }

  > .task-friend {
    opacity: 0.75;
  }
`;

const PreviewLink = styled.a`
  opacity: 0.85;
  background: rgba(97, 175, 239, 0.55);
  color: white;
  width: 56px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(97, 175, 239, 0.75);
    opacity: 1;
  }

  i {
    margin-left: -5px;
    transform: scale(1.2);
    color: white !important;
  }
`;

interface Props {
  task: Task;
  goToTasks: Dispatch;
  friendName: string;
}

const WorkNav: React.SFC<Props> = ({ task, goToTasks, friendName }) => (
  <Wrap>
    <Button secondary className="to-tasks" onClick={goToTasks}>
      &larr; Tasks
    </Button>
    <div className="task">
      <i className="fas fa-code-branch" />
      <span className="task-friend">{friendName}:&nbsp;</span>
      <span className="task-name">
        <i>{task.name}</i>
      </span>
    </div>
    {task.editingFile && (
      <PreviewLink
        href={`/?preview=true&task=${task.id}&file=${task.editingFile}`}
        target="_blank"
      >
        <i className="fas fa-book-open" />
      </PreviewLink>
    )}
  </Wrap>
);

const mapState = (state: AppState): Omit<Props, 'goToTasks'> => {
  const task = requireCurrentTask(state);
  return {
    task,
    friendName: currentTaskFriendName(state),
  };
};

const mapDispatch = {
  goToTasks: () => actions.changeScreen('TASKS'),
};

export default connect(
  mapState,
  mapDispatch,
)(WorkNav);
