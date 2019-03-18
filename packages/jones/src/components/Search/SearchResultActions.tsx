import * as React from 'react';
import styled from '@emotion/styled/macro';
import Button from '../Button';

const SearchResultActions = styled.div`
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 19px;
  opacity: 0;
  transition: opacity 250ms ease;

  > * {
    font-size: 12px;
    width: auto !important;
    padding: 0 12px;
    border-radius: 6px;
    margin-top: 15px;
    margin-left: 8px;
  }

  .replace {
    color: #000;
  }
`;

type Props = {
  dismiss: () => void;
  goto: () => void;
  replace: () => void;
};

const Component: React.SFC<Props> = ({ dismiss, goto, replace }) => (
  <SearchResultActions className="result-actions">
    <Button height={26} secondary onClick={dismiss}>
      <i className="fas fa-times-circle" />
    </Button>
    <Button height={26} secondary onClick={goto}>
      Edit
    </Button>
    <Button
      className="replace"
      height={26}
      onClick={() => {
        dismiss();
        replace();
      }}
    >
      Replace
    </Button>
  </SearchResultActions>
);

export default Component;
