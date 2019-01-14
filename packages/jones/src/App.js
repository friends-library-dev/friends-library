// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import * as screens from './screens';
import './App.css';

class App extends React.Component<*> {

  renderScreen() {
    const { screen } = this.props;
    switch (screen) {
      case screens.TASKS:
        return <h1>tasks</h1>;//<Tasks />;
      case screens.EDIT_TASK:
        return <h1>edit task</h1>;//<Tasks />;
      case screens.WORK:
        return <h1>work</h1>;//<Tasks />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        {this.renderScreen()}
      </div>
    );
  }
}

const mapState = state => ({
  screen: state.screen,
});

export default connect(mapState)(App);
