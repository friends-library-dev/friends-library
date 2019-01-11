// @flow
import * as React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { ipcRenderer as ipc } from '../webpack-electron';

type Props = {|
  keys: Array<string>,
  handle: (any) => *,
|};

export default class KeyCommand extends React.Component<Props> {
  ipcListener = (_: any, key: string): void => {
    const { keys, handle } = this.props;
    if (keys.includes(key)) {
      handle();
    }
  }

  componentDidMount() {
    ipc.on('editor:key-event', this.ipcListener);
  }

  componentWillUnmount() {
    ipc.removeListener('editor:key-event', this.ipcListener);
  }

  render() {
    const { keys, handle } = this.props;
    const crossPlatform = keys.reduce((acc, key) => {
      if (key.match(/^Cmd+/)) {
        acc.push(key.replace(/^Cmd/, 'meta'));
        acc.push(key.replace(/^Cmd/, 'ctrl'));
      } else {
        acc.push(key);
      }
      return acc;
    }, []);

    return (
      <KeyboardEventHandler
        handleKeys={crossPlatform}
        onKeyEvent={handle}
      />
    );
  }
}
