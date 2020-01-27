import React from 'react';
import cx from 'classnames';
import KeyEvent from 'react-keyboard-event-handler';
import { CoverProps, Css, Html } from '@friends-library/types';
import FormControl from '@material-ui/core/FormControl';
import {
  Front,
  ThreeD,
  PrintPdf,
  LogoEnglish,
  LogoSpanish,
  css as coverCss,
} from '@friends-library/cover-component';
import debounce from 'lodash/debounce';
import { FriendData, DocumentData, EditionData } from '../types';
import { friendData, editions, documents, fitScaler, LOREM_BLURB } from './utils';
import Select from './Select';
import Toolbar from './Toolbar';
import CodeEditor from './CodeEditor';
import './App.css';

type Perspective = 'front' | 'spine' | 'back' | 'angle-front' | 'angle-back';
export type Mode = 'pdf' | '3d' | 'ebook';

interface State {
  friendIndex: number;
  docIndex: number;
  edIndex: number;
  fit: boolean;
  showGuides: boolean;
  maskBleed: boolean;
  showCode: boolean;
  mode: Mode;
  perspective: Perspective;
  capturing: 'ebook' | 'audio' | null;
  customBlurbs: Record<string, string>;
  customHtml: Record<string, string>;
  customCss: Record<string, string>;
}

export default class App extends React.Component<{}, State> {
  public state: State = {
    friendIndex: 0,
    docIndex: 0,
    edIndex: 0,
    fit: true,
    showGuides: false,
    showCode: false,
    maskBleed: true,
    mode: '3d',
    capturing: null,
    perspective: 'angle-front',
    customBlurbs: {},
    customCss: {},
    customHtml: {},
  };

  public componentDidMount(): void {
    try {
      let stored = JSON.parse(sessionStorage.getItem('state') || 'null');
      this.setState({ ...this.state, ...stored });
    } catch {}

    window.addEventListener('resize', () => this.forceUpdate());
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('state', JSON.stringify(this.state));
    });

    const query = new URLSearchParams(window.location.search);
    const capturing = query.get('capture');
    if (capturing === 'ebook' || capturing === 'audio') {
      this.setState({ capturing, mode: 'ebook', fit: false });
    } else {
      this.setState({ capturing: null });
    }
    if (query.has('id')) {
      this.setState(this.selectCover(query.get('id') || ''));
    }
  }

  protected selectCover(
    id: string,
  ): {
    friendIndex: number;
    docIndex: number;
    edIndex: number;
  } {
    for (let friendIndex = 0; friendIndex < friendData.length; friendIndex++) {
      const friend = friendData[friendIndex];
      for (let docIndex = 0; docIndex < friend.documents.length; docIndex++) {
        const doc = friend.documents[docIndex];
        for (let edIndex = 0; edIndex < doc.editions.length; edIndex++) {
          const ed = doc.editions[edIndex];
          if (ed.id === id) {
            return {
              friendIndex,
              docIndex,
              edIndex,
            };
          }
        }
      }
    }
    throw new Error(`Cover with ${id} not found`);
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
    const { showGuides, mode } = this.state;
    const { friend, doc, ed } = this.selectedEntities();
    if (!friend || !doc || !ed) return;
    return {
      author: friend.name,
      lang: doc.lang,
      title: doc.title,
      isCompilation: doc.isCompilation,
      size: mode === 'ebook' ? 'xl' : ed.size,
      pages: ed.pages,
      edition: ed.type,
      blurb: this.getBlurb(friend, doc),
      isbn: ed.isbn || '978-1-64476-015-4', // @TODO temp hard-coded during dev
      showGuides,
      allowEditingBlurb: true,
      updateBlurb: this.updateBlurb,
      customCss: this.getCustomCss(),
      customHtml: this.getCustomHtml(),
    };
  }

  protected getBlurb(friend: FriendData, doc: DocumentData): string {
    const key = this.coverKey();
    const { customBlurbs } = this.state;
    if (customBlurbs[key] !== undefined) return customBlurbs[key];
    const blurb = doc.description || friend.description || 'TODO';
    return blurb === 'TODO' ? LOREM_BLURB : blurb;
  }

  protected getCustomCss(): Css {
    const key = this.documentKey();
    if (this.state.customCss[key] !== undefined) {
      return this.state.customCss[key];
    }
    const { doc } = this.selectedEntities();
    return doc && doc.customCss ? doc.customCss : '';
  }

  protected getCustomHtml(): Html {
    const key = this.documentKey();
    if (this.state.customHtml[key] !== undefined) {
      return this.state.customHtml[key];
    }
    const { doc } = this.selectedEntities();
    return doc && doc.customHtml ? doc.customHtml : '';
  }

  protected updateCustomCss(css: Css): void {
    this.setState({
      customCss: {
        ...this.state.customCss,
        [this.documentKey()]: css,
      },
    });
  }

  protected updateCustomHtml(html: Html): void {
    this.setState({
      customHtml: {
        ...this.state.customHtml,
        [this.documentKey()]: html,
      },
    });
  }

  protected documentKey(): string {
    const { friend, doc } = this.selectedEntities();
    if (!friend || !doc) return '[[none]]';
    return `${friend.name}${doc.title}`;
  }

  protected coverKey(): string {
    const { friend, doc, ed } = this.selectedEntities();
    if (!friend || !doc || !ed) return '[[none]]';
    return `${friend.name}${doc.title}${ed.type}`;
  }

  protected spinCover: () => void = () => {
    const { perspective } = this.state;
    const next: { [k in Perspective]: Perspective } = {
      front: 'angle-front',
      'angle-front': 'spine',
      spine: 'angle-back',
      'angle-back': 'back',
      back: 'front',
    };
    this.setState({ perspective: next[perspective] });
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
      perspective,
      showCode,
      mode,
      capturing,
    } = this.state;
    const coverProps = this.coverProps();
    const scaler = coverProps ? fitScaler(coverProps, fit, mode, showCode) : undefined;
    return (
      <div
        className={cx('App', 'web', {
          [`trim--${coverProps ? coverProps.size : 'm'}`]: true,
          'capturing-screenshot': capturing !== null,
          'capturing-audio': capturing === 'audio',
        })}
      >
        <KeyEvent handleKeys={['right']} onKeyEvent={() => this.changeCover(FORWARD)} />
        <KeyEvent handleKeys={['left']} onKeyEvent={() => this.changeCover(BACKWARD)} />
        <KeyEvent handleKeys={['f']} onKeyEvent={() => this.changeFriend(FORWARD)} />
        <KeyEvent
          handleKeys={['esc']}
          onKeyEvent={() =>
            this.setState({
              customBlurbs: {},
              customCss: {},
              customHtml: {},
            })
          }
        />
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
        <KeyEvent
          handleKeys={['s']}
          onKeyEvent={debounce(() => mode === '3d' && this.spinCover(), 250)}
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
            <div className={cx('cover-wrap', { 'cover--ebook': mode === 'ebook' })}>
              {capturing === 'audio' && (
                <div className={`audio-logo audio-logo--${coverProps.lang}`}>
                  {coverProps.lang === 'en' ? <LogoEnglish /> : <LogoSpanish />}
                </div>
              )}
              {mode === '3d' && (
                <ThreeD scaler={scaler} {...coverProps} perspective={perspective} />
              )}
              {mode === 'pdf' && (
                <PrintPdf scaler={scaler} {...coverProps} bleed={!maskBleed} />
              )}
              {mode === 'ebook' && <Front scaler={scaler} {...coverProps} />}
              <style>
                {coverCss.common(scaler).join('\n')}
                {coverCss.front(scaler).join('\n')}
                {coverCss.back(scaler).join('\n')}
                {coverCss.spine(scaler).join('\n')}
                {coverCss.guides(scaler).join('\n')}
                {mode === '3d' ? coverCss.threeD(scaler).join('\n') : ''}
                {mode === 'pdf' ? coverCss.pdf(coverProps, scaler).join('\n') : ''}
              </style>
            </div>
          </>
        )}
        {showCode && (
          <CodeEditor
            css={this.getCustomCss()}
            html={this.getCustomHtml()}
            updateCss={css => this.updateCustomCss(css)}
            updateHtml={html => this.updateCustomHtml(html)}
          />
        )}
        <Toolbar
          fit={fit}
          maskBleed={maskBleed}
          showGuides={showGuides}
          mode={mode}
          spinCover={this.spinCover}
          showCode={showCode}
          cycleMode={() => {
            this.setState({
              mode: mode === 'pdf' ? '3d' : mode === '3d' ? 'ebook' : 'pdf',
            });
          }}
          toggleShowCode={() => this.setState({ showCode: !showCode })}
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
