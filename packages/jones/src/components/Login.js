// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import Button from './Button';

const Div = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
    display: block;
    margin: -15px auto 20px auto;
  }

  .login-btn {
    width: 100%;
    color: white !important;
    display: block;
    margin: 30px auto 15px auto;
  }

  a {
    color: var(--accent);
  }

  > div {
    width: 400px;
    background: white;
    padding: 2em;
    color: #555;
  }

  p {
    line-height: 140%;
  }
`;

export default () => {

  const url = [
    'https://github.com/login/oauth/authorize',
    `?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID || ''}`,
    '&scope=repo,read:user',
    '&state=894c5e7f-c83f-4bd3-b299-47b754d9b506',
  ].join('');

  return (
    <Div>
      <div>
        <p>
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="github logo"
          />
          To use the <i>Friends Library Editor,</i> you'll need to login with a
          (free) <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a> account.
        </p>
        <Button className="login-btn" href={url}>Login</Button>
      </div>
    </Div>
  );
};
