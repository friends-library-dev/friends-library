// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import * as actions from '../actions';
import * as gh from '../lib/github-api';
import fox from '../george-fox.png';
import NavContent from './NavContent';

const Div = styled.div`
  height: 50px;
  color: #ddd;
  background: black;
  display: flex;
  line-height: 50px;

  & .icon,
  & .avatar {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    margin: 5px;
  }

  & .center {
    padding-left: 0.5em;
    flex-grow: 1;

    & i {
      padding-left: 0.25em;
      color: var(--accent);
    }
  }

  & .github {
    background-color: #111;
    color: #bbb;
    display: flex;
    & .name {
      padding: 0 0.5em 0 0.8em;
      display: block;
    }
  }
`;

class TopNav extends React.Component<*> {

  componentDidMount() {
    const { token, avatar, requestGitHubUser } = this.props;
    gh.authenticate(token);
    if (!avatar) {
      requestGitHubUser();
    }
  }

  render() {
    const { avatar, name, screen, user } = this.props;
    return (
      <Div>
        <img className="icon" src={fox} alt="" />
        <div className="center">
          <NavContent screen={screen} />
        </div>
        {(name || user) && <div className="github">
          <span className="name">{name ? name : user}</span>
          <img className="avatar" src={avatar} alt="" />
        </div>}
      </Div>
    )
  }
}

const mapState = state => ({
  ...state.github,
  screen: state.screen,
});

const mapDispatch = {
  requestGitHubUser: actions.requestGitHubUser,
}

export default connect(mapState, mapDispatch)(TopNav);
