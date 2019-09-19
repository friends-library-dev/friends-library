import React from 'react';
import styled from './styled';

const Hamburger = styled('div')<{ isX: boolean }>`
  width: 70px;
  height: 70px;
  padding-left: 18px;

  & > * {
    display: block;
    height: 2px;
    width: 32px;
    margin-bottom: 5px;
  }

  .Bun__Top {
    width: 27px;
  }

  .Bun__Bottom {
    width: 18px;
    margin-bottom: 0;
  }
`;

interface Props {
  menuOpen: boolean;
  onClick: () => void;
}

const Component: React.FC<Props> = ({ menuOpen, onClick }) => (
  <Hamburger
    className="Hamburger flex flex-col justify-center bg-flprimary"
    isX={menuOpen}
    onClick={onClick}
  >
    <b className="Bun Bun__Top bg-white" />
    <b className="Meat bg-white" />
    <b className="Bun Bun__Bottom bg-white" />
  </Hamburger>
);

export default Component;
