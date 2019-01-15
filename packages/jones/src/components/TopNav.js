// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import * as actions from '../actions';
import * as gh from '../lib/github-api';
import fox from '../george-fox.png';

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
      color: var(--accent);
    }
  }

  & .github {
    background-color: #111;
    color: #bbb;
    display: flex;
    & .name {
      padding: 0 0.5em 0 1em;
      display: block;
    }
  }
`;
// "<https://api.github.com/organizations/32500148/repos?access_token=7586ce05e74ca8f0fde1beb563921254551e7dbb&page=2>; rel="next", <https://api.github.com/organizations/32500148/repos?access_token=7586ce05e74ca8f0fde1beb563921254551e7dbb&page=2>; rel="last""
class TopNav extends React.Component<*> {

  componentDidMount() {
    const { token, avatar, requestGitHubUser } = this.props;
    gh.authenticate(token);
    if (!avatar) {
      requestGitHubUser();
    }
  }

  render() {
    const { avatar, name } = this.props;
    return (
      <Div>
        <img className="icon" src={fox} alt="" />
        <div className="center">
          Friends Library Publishing <i>Online Editor</i>
        </div>
        {name && <div className="github">
          <span className="name">{name}</span>
          <img className="avatar" src={avatar} alt="" />
        </div>}
      </Div>
    )
  }
}

// const mapState = state => ({
//   name: state.github.name,
//   avatar: state.github.avatar,
// });
const mapState = ({ github }) => github;

const mapDispatch = {
  requestGitHubUser: actions.requestGitHubUser,
}

export default connect(mapState, mapDispatch)(TopNav);
