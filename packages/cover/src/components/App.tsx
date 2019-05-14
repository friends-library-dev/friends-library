import React from 'react';
import classNames from 'classnames';
import KeyEvent from 'react-keyboard-event-handler';
import { CoverProps } from '@friends-library/types';
import Cover from './Cover/Cover';
import { coverCss } from './Cover/css';
import FormControl from '@material-ui/core/FormControl';
import {
  friendData,
  formatBlurb,
  editions,
  documents,
  fitScaler,
  prepareTitle,
  LOREM_BLURB,
} from './utils';
import Select from './Select';
import Toolbar from './Toolbar';
import './App.css';
import { FriendData, DocumentData, EditionData } from './Cover/types';

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
  customBlurbs: Record<string, string>;
}

export default class App extends React.Component<{}, State> {
  public state: State = {
    friendIndex: 0,
    docIndex: 0,
    edIndex: 0,
    fit: true,
    showGuides: false,
    maskBleed: true,
    threeD: true,
    threeDView: 'angle-front',
    customBlurbs: {},
  };

  public componentDidMount(): void {
    try {
      let stored = JSON.parse(sessionStorage.getItem('state') || 'null');
      this.setState({ ...this.state, ...stored });
    } catch {}

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('state', JSON.stringify(this.state));
    });

    window.addEventListener('resize', () => this.forceUpdate());
  }

  protected selectedEntities(): {
    friend?: FriendData;
    doc?: DocumentData;
    ed?: EditionData;
  } {
    const { friendIndex, docIndex, edIndex } = this.state;
    if ([friendIndex, docIndex, edIndex].map(Number).includes(-1)) {
      return {};
    }
    const friend = friendData[friendIndex];
    if (!friend) return {};
    const doc = friend.documents[docIndex];
    if (!doc) return { friend };
    const ed = doc.editions[edIndex];
    if (!ed) return { friend, doc };
    return { friend, doc, ed };
  }

  protected coverProps(): CoverProps | undefined {
    const { showGuides } = this.state;
    const { friend, doc, ed } = this.selectedEntities();
    if (!friend || !doc || !ed) return;
    return {
      author: friend.name,
      title: prepareTitle(doc.title, friend.name),
      printSize: ed.defaultSize,
      pages: ed.pages[ed.defaultSize],
      edition: ed.type,
      blurb: formatBlurb(this.getBlurb(friend, doc)),
      isbn: ed.isbn || '978-1-64476-015-4', // @TODO temp hard-coded during dev
      showGuides,
    };
  }

  protected getBlurb(friend: FriendData, doc: DocumentData): string {
    const key = this.coverKey();
    const { customBlurbs } = this.state;
    if (customBlurbs[key] !== undefined) return customBlurbs[key];
    const blurb = doc.description || friend.description || 'TODO';
    return blurb === 'TODO' ? LOREM_BLURB : blurb;
  }

  protected coverKey(): string {
    const { friend, doc, ed } = this.selectedEntities();
    if (!friend || !doc || !ed) return '[[none]]';
    return `${friend.name}${doc.title}${ed.type}`;
  }

  protected clickCover: (e: any) => void = e => {
    if (e.target.contentEditable === 'true') return;
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
  };

  public updateBlurb: (blurb: string) => void = blurb => {
    const key = this.coverKey();
    const { customBlurbs } = this.state;
    this.setState({
      customBlurbs: {
        ...customBlurbs,
        [key]: blurb,
      },
    });
  };

  public changeCover(dir: Direction): void {
    const { friendIndex, docIndex, edIndex } = this.state;
    const friend = friendData[friendIndex];
    if (!friend) {
      this.setState({ friendIndex: 0, docIndex: 0, edIndex: 0 });
      return;
    }

    const doc = friend.documents[docIndex];
    if (!doc) {
      this.setState({ docIndex: 0, edIndex: 0 });
      return;
    }

    const ed = doc.editions[edIndex];
    if (!ed) {
      this.setState({ edIndex: 0 });
      return;
    }

    if (dir === FORWARD) {
      if (edIndex < doc.editions.length - 1) {
        this.setState({ edIndex: edIndex + 1 });
      } else if (docIndex < friend.documents.length - 1) {
        this.setState({ docIndex: docIndex + 1, edIndex: 0 });
      } else if (friendIndex < friendData.length - 1) {
        this.setState({ friendIndex: friendIndex + 1, docIndex: 0, edIndex: 0 });
      } else {
        this.setState({ friendIndex: 0, docIndex: 0, edIndex: 0 });
      }
      return;
    }

    if (edIndex > 0) {
      this.setState({ edIndex: edIndex - 1 });
    } else if (docIndex > 0) {
      this.setState({
        docIndex: docIndex - 1,
        edIndex: friend.documents[docIndex - 1].editions.length - 1,
      });
    } else if (friendIndex > 0) {
      const newDocs = friendData[friendIndex - 1].documents;
      this.setState({
        friendIndex: friendIndex - 1,
        docIndex: newDocs.length - 1,
        edIndex: newDocs[newDocs.length - 1].editions.length - 1,
      });
    } else {
      const lastFriendIndex = friendData.length - 1;
      const lastFriendDocs = friendData[lastFriendIndex].documents;
      const lastDocIndex = lastFriendDocs.length - 1;
      const lastDoc = lastFriendDocs[lastDocIndex];
      this.setState({
        friendIndex: lastFriendIndex,
        docIndex: lastDocIndex,
        edIndex: lastDoc.editions.length - 1,
      });
    }
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
        <KeyEvent handleKeys={['right']} onKeyEvent={() => this.changeCover(FORWARD)} />
        <KeyEvent handleKeys={['left']} onKeyEvent={() => this.changeCover(BACKWARD)} />
        <KeyEvent handleKeys={['f']} onKeyEvent={() => this.changeFriend(FORWARD)} />
        <KeyEvent
          handleKeys={['shift+f']}
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
        <KeyEvent
          handleKeys={['g']}
          onKeyEvent={() => this.setState({ showGuides: !showGuides })}
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
                'mask-bleed': maskBleed,
              })}
              onClick={this.clickCover}
            >
              <Cover {...coverProps} updateBlurb={this.updateBlurb} />
              <style>{coverCss(coverProps, fitScaler(coverProps, fit, threeD))}</style>
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
