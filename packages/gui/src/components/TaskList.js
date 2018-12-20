// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { workOnTask } from '../actions';

const List = styled.ul`
  margin: 45px 0;
  padding: 0;

  & li {
    background: orange;
    color: #444;
    display: inline-block;
    width: 250px;
    height: 80px;
    list-style: none;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 11px 18px;
    cursor: pointer;
  }

  & h1 {
    font-size: 22px;
    margin: 0;
  }

  & p {
    font-size: 16px;
    padding-left: 1.4em;
    color: #555;
  }

  & i {
    padding-right: 0.4em;
  }
`;

const TaskList = ({ tasks, friends, workOnTask }) => {
  return (
    <List>
      {tasks.map(task => {
        const friend = friends[`en/${task.repo}`];
        return (
          <li onClick={() => workOnTask(task.id)} key={task.id}>
            <h1>
              <i className="fas fa-code-branch" />
              {task.name}
            </h1>
            <p>
              <i className={`fas fa-${friend.gender}`} />
              Friend: <em>{friend.name}</em>
            </p>
          </li>
        );
      })}
    </List>
  );
};

const mapState = state => ({
  friends: state.friends,
  tasks: state.tasks,
});

const mapDispatch = {
  workOnTask,
};

export default connect(mapState, mapDispatch)(TaskList);
