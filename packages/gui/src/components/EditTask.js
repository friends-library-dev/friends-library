// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { updateTask, changeScreen, deleteTask } from '../actions';
import * as screens from '../screens';

const FriendList = styled.ul`
  margin: 0;
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

const Heading = styled.h3`
  color: #61afef;
  margin-bottom: 12px;
  margin-top: 35px;
`;

const Button = styled.span`
  opacity: ${(props) => props.disabled ? 0.15 : 1};
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  display: inline-block;
  width: 190px;
  height: 50px;
  background: #666;
  margin: 50px 20px 0 0;
  text-align: center;
  line-height: 50px;
`;

class EditTask extends React.Component<*, *> {

  constructor(props) {
    super(props);
    this.state = {
      name: props.task.name,
      repo: props.task.repo,
    };
  }

  render() {
    const { name, repo } = this.state;
    const { task, friends, updateTask, changeScreen, deleteTask } = this.props;
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
        <Button
          onClick={() => {
            if (task.isNew) {
              deleteTask(task.id);
            }
            changeScreen(screens.WELCOME);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!repo || !name.trim()}
          style={{ background: '#61afef'}}
          onClick={() => {
            if (!repo || !name.trim()) {
              return;
            }
            updateTask({
              id: task.id,
              data: {
                name,
                repo,
                isNew: false,
              }
            });
            changeScreen(screens.WELCOME);
          }}
        >
          Save
        </Button>
      </div>
    )
  }
}

const mapState = state => ({
  friends: Object.values(state.friends),
  task: state.tasks.find(({ id }) => id === state.currentTask),
});

const mapDispatch = {
  updateTask,
  changeScreen,
  deleteTask,
};

export default connect(mapState, mapDispatch)(EditTask);
