// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import Button from './Button';

const Save = styled(Button)`
  opacity: ${({ enabled }) => (enabled ? 1 : 0.4)};
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'not-allowed')};
  background: ${({ enabled }) => (enabled ? 'var(--accent)' : '#666')};

  & i {
    padding-right: 0.5em;
  }

  & .badge {
    margin-left: 0.5em;
    color: white;
    background: orange;
    border-radius: 50%;
    font-weight: bold;
    width: 15px;
    height: 15px;
    padding: 0 7px;
  }
`;

type Props = {|
  numEdited: number,
  onClick: (any) => *,
|};

export default ({ numEdited, onClick }: Props) => (
  <Save
    height={35}
    enabled={numEdited > 0}
    onClick={onClick}
  >
    <i className="fas fa-save" />
    Save
    {numEdited > 1 && (
      <span className="badge">
        <b>{numEdited}</b>
      </span>
    )}
  </Save>
);
