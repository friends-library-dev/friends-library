import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import * as actions from '../actions';
import * as gh from '../lib/github-api';
import fox from '../assets/george-fox.png';
import throbber from '../assets/throbber.gif';
import NavContent from './NavContent';
import { Dispatch, State as AppState } from '../type';

const TopNav = styled.div`
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

  .icon {
    transition: opacity 200ms ease;
    opacity: ${(p: any) => (p.throbbing ? 0.5 : 1)};
  }

  .spinner {
    opacity: ${(p: any) => (p.throbbing ? 0.75 : 0)};
    width: 20px;
    height: 20px;
    position: absolute;
    top: 15px;
    left: 15px;
  }

  & .center {
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

interface Props {
  token: string;
  requestGitHubUser: Dispatch;
  name?: string;
  avatar?: string;
  user: string;
  throbbing: boolean;
  screen: string;
}

class Component extends React.Component<Props> {
  public componentDidMount(): void {
    const { token, requestGitHubUser } = this.props;
    gh.authenticate(token);
    // always re-request the github user so we pull in new avatars, etc
    requestGitHubUser();
  }

  public render(): JSX.Element {
    const { avatar, name, screen, user, throbbing } = this.props;
    return (
      <TopNav throbbing={throbbing}>
        <img className="icon" src={fox} alt="" />
        <img className="spinner" src={throbber} alt="" />
        <div className="center">
          <NavContent screen={screen} />
        </div>
        {user && (
          <div className="github">
            <span className="name">{name ? name : user}</span>
            {avatar && <img className="avatar" src={avatar} alt="" />}
          </div>
        )}
      </TopNav>
    );
  }
}

const mapState = (state: AppState): Omit<Props, 'requestGitHubUser'> => {
  if (state.github.token === null) {
    throw new Error('No github token found');
  }
  return {
    ...state.github,
    screen: state.screen,
    throbbing: state.network.length > 0,
  };
};

const mapDispatch = {
  requestGitHubUser: actions.requestGitHubUser,
};

export default connect(
  mapState,
  mapDispatch,
)(Component);
