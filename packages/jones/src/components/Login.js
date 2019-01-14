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

  & > div {
    width: 500px;
    height: 300px;
    background: #eee;
    padding: 2em;
    color: #000;

    & p {

    }
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
          To use the editor, you'll need to login with a
          (free) <a href="https://github.com">GitHub</a> account.
        </p>
        <Button onClick={() => window.location.assign(url)}>Login</Button>
      </div>
    </Div>
  );
};
