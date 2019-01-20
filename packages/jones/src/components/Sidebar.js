// @flow
import * as React from 'react';
import styled from '@emotion/styled/macro';
import { connect } from 'react-redux';
import Resizable from 're-resizable';
import type { Dispatch } from '../type';
import FriendFiles from './FriendFiles';
import { currentTask } from '../select';
import * as actions from '../actions';

const Div = styled(Resizable)`
  background: #333;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  z-index: 2;
  transform: translateZ(0);

  .resize-handle {
    position: static;
    > div {
      right: 0 !important;
    }
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
  height: calc(100vh - 50px);
  z-index: 2;
`;

type ToggleProps = {|
  onClick: (any) => *,
  isOpen: boolean,
|};

const Toggle = ({ onClick, isOpen }: ToggleProps) => (
  <ToggleEl className="toggle" onClick={onClick} open={isOpen}>
    <i className={`fas fa-angle-${isOpen ? 'right' : 'left'}`} />
  </ToggleEl>
);


type Props = {|
  open: boolean,
  width: number,
  toggleOpen: Dispatch,
  updateWidth: Dispatch,
|};

class Sidebar extends React.Component<Props> {
  render() {
    const { open, width, toggleOpen, updateWidth } = this.props;
    if (!open) {
      return (
        <Closed>
          <Toggle onClick={toggleOpen} isOpen />
        </Closed>
      );
    }
    return (
      <Div
        minWidth={200}
        defaultSize={{ width }}
        handleWrapperClass="resize-handle"
        onResizeStop={(e, dir, ref, delta) => {
          updateWidth(width + delta.width);
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
        <Toggle onClick={toggleOpen} isOpen={false} />
        <FriendFiles />
      </Div>
    );
  }
}

const mapState = state => {
  const task = currentTask(state) || {};
  return {
    open: task.sidebarOpen,
    width: task.sidebarWidth,
  };
};

const mapDispatch = {
  toggleOpen: actions.toggleSidebarOpen,
  updateWidth: actions.updateSidebarWidth,
}

export default connect(mapState, mapDispatch)(Sidebar);
