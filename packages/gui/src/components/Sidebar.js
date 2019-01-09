// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import Resizable from 're-resizable';
import type { Friend } from '../redux/type';
import FriendFiles from './FriendFiles';

const Div = styled(Resizable)`
  background: #333;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  z-index: 2;
  transform: translateZ(0);

  & .resize-handle > div {
    right: 0 !important;
  }
`;

const ToggleEl = styled.div`
  cursor: pointer;
  width: 25px;
  height: 50px;
  border-bottom-${props => props.open ? 'right' : 'left'}-radius: 50px;
  border-top-${props => props.open ? 'right' : 'left'}-radius: 50px;
  background: ${props => props.open ? '#111' : '#25282c'};
  z-index: 5;
  position: fixed;
  ${props => props.open ? 'left' : 'right'}: 0px;
  top: calc(50% - 25px);

  & i {
    line-height: 50px;
    color: grey;
    width: 100%;
    text-align: center;
    font-size: 20px;
  }

  * >  & {
    display: opacity 0;
    visibility: hidden;
  }

  *:hover > & {
    visibility: visible;
    opacity: 1;
  }
`;

const Closed = styled.div`
  width: 25px;
  background: transparent;
  position: absolute;
  height: calc(100vh - 35px);
  z-index: 2;
`;

type Props = {|
  friend: Friend,
|};

type State = {|
  width: number,
  open: boolean,
|};

type ToggleProps = {|
  onClick: (any) => *,
  isOpen: boolean,
|};

const Toggle = ({ onClick, isOpen }: ToggleProps) => (
  <ToggleEl className="toggle" onClick={onClick} open={isOpen}>
    <i className={`fas fa-angle-${isOpen ? 'right' : 'left'}`} />
  </ToggleEl>
);

class Sidebar extends React.Component<Props, State> {
  state = {
    open: true,
    width: 400,
  }

  toggle = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  render() {
    const { open, width } = this.state;
    const { friend } = this.props;
    if (!open) {
      return (
        <Closed>
          <Toggle onClick={this.toggle} isOpen />
        </Closed>
      );
    }
    return (
      <Div
        minWidth={200}
        handleWrapperClass="resize-handle"
        onResizeStop={(e, dir, ref, delta) => {
          this.setState({ width: width + delta.width });
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <Toggle onClick={this.toggle} isOpen={false} />
        <FriendFiles friend={friend} />
      </Div>
    );
  }
}

export default Sidebar;
