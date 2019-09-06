import React from 'react';
import { styled, SlideoverMenu } from '@friends-library/ui';
import './Slideover.css';

const Slideover = styled.div<{ isOpen: boolean }>`
  transform: ${({ isOpen }) => (isOpen ? 'none' : 'translate3d(-100%, 0, 0)')};
  & > nav {
    background: ${({ theme }) => theme.primary.rgba(0.985)};
  }
`;

interface Props {
  isOpen: boolean;
  close: () => void;
}

export default ({ isOpen, close }: Props) => (
  <Slideover className="Slideover" isOpen={isOpen}>
    <SlideoverMenu onClose={close} />
  </Slideover>
);
