// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Task from './Task';

const List = styled.ul`
  margin: 45px 0;
  padding: 0;
`;

const TaskList = ({ tasks, friends, workOnTask }) => {
  return (
    <List>
      {tasks.map(task => <Task key={task.id} task={task} />)}
    </List>
  );
};

const mapState = state => ({
  tasks: Object.values(state.tasks),
});

export default connect(mapState)(TaskList);

/*

user clicks submit
component state: submitting=true, prOpen=false
await git push task-uuid
when push complete:
  - component state: submitting=false
  - dispatch updateTask({ submitted: true })
  - PR button says "Create PR"
  - once PR button clicked
    -component state: prOpen=true



 */
