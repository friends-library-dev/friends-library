import React from 'react';
import { styled } from '@friends-library/ui';
import Button from '../UnstyledButton';

const Wrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${p => p.theme.primary.rgba(0.9)};

  > button {
    position: absolute;
    top: 10px;
    left: 10px;
    background: ${p => p.theme.black.rgba(0.65)};
    text-align: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.75);
    font-size: 17px;
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  > div {
    max-width: calc(100vw - 20px);
  }
`;

interface Props {
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ children, onClose }) => (
  <Wrap>
    <Button onClick={onClose}>&#x2715;</Button>
    <div>{children}</div>
  </Wrap>
);

export default Modal;
