// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Dispatch } from '../redux/type';
import * as actions from '../redux/actions';
import { currentTaskFriend, editedCurrentTaskFiles } from '../redux/select';
import Save from './Save';
import Button from './Button';

const Nav = styled.nav`
  height: 35px;
  line-height: 35px;
  background: black;
  display: flex;

  & .task {
    padding-left: 1em;
    flex-grow: 1;

    & .icon {
      color: var(--accent);
      padding-right: 0.4em;
    }
  }

  & .task-friend {
    opacity: 0.75;
  }
`;

type Props = {|
  taskName: string,
  friendName: string,
  toTasks: Dispatch,
  save: Dispatch,
  numEdited: number,
|};

const WorkNav = ({ toTasks, friendName, taskName, save, numEdited }: Props) => (
  <Nav>
    <Button
      secondary
      height={35}
      className="to-tasks"
      onClick={() => {
        save();
        toTasks();
      }}
    >
      &larr; Tasks
    </Button>
    <div className="task">
      <i className="fas fa-code-branch icon" />
      <span className="task-friend">{friendName}:&nbsp;</span>
      <span className="task-name"><i>{taskName}</i></span>
    </div>
    <Save onClick={save} numEdited={numEdited} />
  </Nav>
);

const mapState = state => {
  const { friend, task } = currentTaskFriend(state);
  return {
    numEdited: editedCurrentTaskFiles(state).length,
    friendName: friend.name,
    taskName: task.name,
  };
};

const mapDispatch = dispatch => ({
  save: () => dispatch(actions.saveCurrentTaskEditedFiles()),
  toTasks: () => dispatch(actions.changeScreen('TASKS')),
});

export default connect(mapState, mapDispatch)(WorkNav);
