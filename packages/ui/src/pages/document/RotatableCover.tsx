import React from 'react';
import cx from 'classnames';
import { ThreeD } from '@friends-library/cover-component';
import Rotate from '../../icons/Rotate';
import { CoverProps } from '@friends-library/types';

type Perspective = 'back' | 'front' | 'spine' | 'angle-front' | 'angle-back';

interface Props {
  coverProps: CoverProps;
  className?: string;
}

interface State {
  perspective: Perspective;
  shouldRotate: boolean;
  controlled: boolean;
  showBackTimeout?: number;
  backToFrontTimeout?: number;
}

export default class RotatableCover extends React.Component<Props, State> {
  public state: State = {
    perspective: `angle-front`,
    controlled: false,
    shouldRotate: false,
  };

  public componentDidMount(): void {
    if (window.CSS && window.CSS.supports(`writing-mode`, `vertical-lr`)) {
      this.setState({ shouldRotate: true });
    } else {
      return;
    }

    const showBackTimeout = window.setTimeout(
      () => this.setState({ perspective: `angle-back` }),
      10000,
    );
    this.setState({ showBackTimeout });
    const backToFrontTimeout = window.setTimeout(
      () => this.setState({ perspective: `angle-front` }),
      14000,
    );
    this.setState({ backToFrontTimeout });
  }

  public componentWillUnmount(): void {
    const { showBackTimeout, backToFrontTimeout } = this.state;
    [showBackTimeout, backToFrontTimeout].forEach(clearTimeout);
  }

  public render(): JSX.Element {
    const { className, coverProps } = this.props;
    const { perspective, shouldRotate, showBackTimeout, backToFrontTimeout } = this.state;
    return (
      <div className={cx(className, `flex flex-col items-center`)}>
        <div className="hidden xl:block">
          <ThreeD {...coverProps} perspective={perspective} scaler={4 / 5} scope="4-5" />
        </div>
        <div className="xl:hidden">
          <ThreeD {...coverProps} perspective={perspective} scaler={3 / 5} scope="3-5" />
        </div>
        <button
          className={cx(`focus:outline-none pt-1`, !shouldRotate && `hidden`)}
          onClick={() => {
            [showBackTimeout, backToFrontTimeout].forEach(clearTimeout);
            this.setState({
              perspective: nextPerspective(perspective),
              controlled: true,
              showBackTimeout: undefined,
              backToFrontTimeout: undefined,
            });
          }}
        >
          <Rotate />
        </button>
      </div>
    );
  }
}

function nextPerspective(perspective: Perspective): Perspective {
  switch (perspective) {
    case `angle-front`:
      return `spine`;
    case `spine`:
      return `angle-back`;
    case `angle-back`:
      return `back`;
    case `back`:
      return `front`;
    default:
      return `angle-front`;
  }
}
