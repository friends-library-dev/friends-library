import React from 'react';
import styled from './styled';

const Hamburger = styled('div')<{ isX: boolean }>`
  width: 34px;
  height: 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s;
  transform: ${p => (p.isX ? 'translateX(10px)' : 'none')};

  & > * {
    display: block;
    height: 2px;
    margin-bottom: 6px;
    background-color: ${p => p.theme.primary.hex};
    transition: transform 0.25s;
  }

  .Meat {
    opacity: ${p => (p.isX ? '0' : '1')};
    transition: opacity ${p => (p.isX ? '0' : '0.125s')};
    transition-delay: ${p => (p.isX ? '0' : '0.125s')};
  }

  .Bun__Top {
    transform: ${p => (p.isX ? 'rotate(45deg) translateY(11px)' : 'none')};
  }

  .Bun__Bottom {
    margin-bottom: 0;
    transform: ${p => (p.isX ? 'rotate(-45deg) translateY(-11px)' : 'none')};
  }
`;

interface Props {
  menuOpen: boolean;
  onClick: () => void;
}

const Component: React.FC<Props> = ({ menuOpen, onClick }) => (
  <Hamburger className="Hamburger" isX={menuOpen} onClick={onClick}>
    <span className="Bun Bun__Top" />
    <span className="Meat" />
    <span className="Bun Bun__Bottom" />
  </Hamburger>
);

export default Component;
