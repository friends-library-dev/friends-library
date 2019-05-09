import React from 'react';
import classNames from 'classnames';
import KeyEvent from 'react-keyboard-event-handler';
import { CoverProps } from '@friends-library/types';
import Cover from './Cover/Cover';
import { coverCss } from './Cover/css';
import FormControl from '@material-ui/core/FormControl';
import { friendData, blurb, editions, documents, fitScaler, prepareTitle } from './utils';
import Select from './Select';
import Toolbar from './Toolbar';
import './App.css';

type View = 'front' | 'spine' | 'back' | 'angle-front' | 'angle-back';

interface State {
  friendIndex: number;
  docIndex: number;
  edIndex: number;
  fit: boolean;
  showGuides: boolean;
  maskBleed: boolean;
  threeD: boolean;
  threeDView: View;
}

export default class App extends React.Component<{}, State> {
  public state = {
    friendIndex: 0,
    docIndex: 0,
    edIndex: 0,
    fit: true,
    showGuides: false,
    maskBleed: true,
    threeD: true,
    threeDView: 'angle-front' as View,
  };

  public componentDidMount(): void {
    try {
      let stored = JSON.parse(localStorage.getItem('state') || 'null');
      this.setState({ ...this.state, ...stored });
    } catch {}

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('state', JSON.stringify(this.state));
    });

    window.addEventListener('resize', () => this.forceUpdate());
  }

  protected coverProps(): CoverProps | undefined {
    const { friendIndex, docIndex, edIndex, showGuides } = this.state;
    if ([friendIndex, docIndex, edIndex].map(Number).includes(-1)) {
      return;
    }

    const friend = friendData[friendIndex];
    if (!friend) return;

    const doc = friend.documents[docIndex];
    if (!doc) return;

    const ed = doc.editions[edIndex];
    if (!ed) return;

    return {
      author: friend.name,
      title: prepareTitle(doc.title, friend.name),
      printSize: ed.defaultSize,
      pages: ed.pages[ed.defaultSize],
      edition: ed.type,
      blurb: blurb(doc, friend),
      isbn: '978-1-64476-015-4', // @TODO temp hard-coded during dev
      showGuides,
    };
  }

  protected clickCover(): void {
    const { threeD, threeDView } = this.state;
    if (!threeD) return;
    const next: { [k in View]: View } = {
      front: 'angle-front',
      'angle-front': 'spine',
      spine: 'angle-back',
      'angle-back': 'back',
      back: 'front',
    };
    this.setState({ threeDView: next[threeDView] });
  }

  public changeFriend(dir: Direction): void {
    const { friendIndex } = this.state;

    // prettier-ignore
    const next = dir === FORWARD
      ? friendIndex === friendData.length - 1 ? 0 : friendIndex + 1
      : friendIndex === 0 ? friendData.length - 1 : friendIndex - 1;

    this.setState({
      friendIndex: next,
      docIndex: 0,
      edIndex: 0,
    });
  }

  public changeDocument(dir: Direction): void {
    const { friendIndex, docIndex } = this.state;
    const docs = documents(friendIndex);
    if (docs.length < 1) {
      return;
    }

    // prettier-ignore
    const next = dir === FORWARD
      ? docIndex === docs.length - 1 ? 0 : docIndex + 1
      : docIndex === 0 ? docs.length - 1 : docIndex - 1

    this.setState({
      docIndex: next,
      edIndex: 0,
    });
  }

  public changeEdition(dir: Direction): void {
    const { friendIndex, docIndex, edIndex } = this.state;
    const docs = documents(friendIndex);
    if (docs.length < 1) {
      return;
    }

    const eds = editions(friendIndex, docIndex);
    if (eds.length < 1) {
      return;
    }

    // prettier-ignore
    const next = dir === FORWARD
      ? edIndex === eds.length - 1 ? 0 : edIndex + 1
      : edIndex === 0 ? eds.length - 1 : edIndex - 1

    this.setState({
      edIndex: next,
    });
  }

  public render(): JSX.Element {
    const {
      friendIndex,
      docIndex,
      edIndex,
      fit,
      showGuides,
      maskBleed,
      threeD,
      threeDView,
    } = this.state;
    const coverProps = this.coverProps();
    return (
      <div className={`App web trim--${coverProps ? coverProps.printSize : 'm'}`}>
        <KeyEvent
          handleKeys={['right', 'f']}
          onKeyEvent={() => this.changeFriend(FORWARD)}
        />
        <KeyEvent
          handleKeys={['left', 'shift+f']}
          onKeyEvent={() => this.changeFriend(BACKWARD)}
        />
        <KeyEvent
          handleKeys={['up', 'd']}
          onKeyEvent={() => this.changeDocument(FORWARD)}
        />
        <KeyEvent
          handleKeys={['down', 'shift+d']}
          onKeyEvent={() => this.changeDocument(BACKWARD)}
        />
        <KeyEvent
          handleKeys={['pageup', 'e']}
          onKeyEvent={() => this.changeEdition(FORWARD)}
        />
        <KeyEvent
          handleKeys={['pagedown', 'shift+e']}
          onKeyEvent={() => this.changeEdition(BACKWARD)}
        />
        <form autoComplete="off" style={{ padding: '1em 1em 0 1em', display: 'flex' }}>
          <FormControl style={{ minWidth: 200, marginRight: '1em' }}>
            <Select
              label="Friend"
              value={friendIndex}
              options={friendData.map(f => f.name)}
              onChange={e => {
                this.setState({
                  friendIndex: Number(e.target.value),
                  docIndex: 0,
                  edIndex: 0,
                });
              }}
            />
          </FormControl>
          <FormControl style={{ flexGrow: 1, marginRight: '1em' }}>
            <Select
              label="Document"
              value={docIndex}
              options={documents(friendIndex).map(d => d.title)}
              onChange={e => {
                this.setState({
                  docIndex: Number(e.target.value),
                  edIndex: 0,
                });
              }}
            />
          </FormControl>
          <FormControl style={{ minWidth: 140 }}>
            <Select
              label="Edition"
              value={edIndex}
              options={editions(friendIndex, docIndex).map(e => e.type)}
              onChange={e => this.setState({ edIndex: Number(e.target.value) })}
            />
          </FormControl>
        </form>
        {!coverProps && <div style={{ flexGrow: 1 }} />}
        {coverProps && (
          <>
            <div
              className={classNames('cover-wrap', {
                'cover--3d': threeD,
                'cover--3d--front': threeD && threeDView === 'front',
                'cover--3d--spine': threeD && threeDView === 'spine',
                'cover--3d--back': threeD && threeDView === 'back',
                'cover--3d--angle-front': threeD && threeDView === 'angle-front',
                'cover--3d--angle-back': threeD && threeDView === 'angle-back',
              })}
              onClick={() => this.clickCover()}
            >
              <Cover {...coverProps} />
              <style>
                {coverCss(coverProps, fitScaler(coverProps, fit, threeD))}
                {maskBleed
                  ? '.guide--trim-bleed { opacity: 0 }'
                  : '.cover-mask { display: none }'}
              </style>
            </div>
          </>
        )}
        <Toolbar
          fit={fit}
          maskBleed={maskBleed}
          showGuides={showGuides}
          threeD={threeD}
          toggleThreeD={() => {
            const newState = !threeD;
            this.setState({
              threeD: newState,
              threeDView: newState === false ? 'angle-front' : this.state.threeDView,
            });
          }}
          toggleFit={() => this.setState({ fit: !fit })}
          toggleShowGuides={() => this.setState({ showGuides: !showGuides })}
          toggleMaskBleed={() => this.setState({ maskBleed: !maskBleed })}
          coverProps={coverProps}
        />
      </div>
    );
  }
}

type Direction = 'FORWARD' | 'BACKWARD';
const FORWARD = 'FORWARD';
const BACKWARD = 'BACKWARD';
