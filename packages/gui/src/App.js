import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const {app} = window.require('electron').remote;

console.log(Object.keys(window.require('electron')));

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Version: {app.getVersion()}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
