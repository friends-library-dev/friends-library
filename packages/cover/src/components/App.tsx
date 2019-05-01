import React from 'react';
import Cover from './Cover/Cover';
import { coverCss } from './Cover/css';
import FormControl from '@material-ui/core/FormControl';
import { CoverProps } from './Cover/types';
import { friendData, blurb, editions, documents, fitScaler } from './utils';
import Select from './Select';
import Toolbar from './Toolbar';
import './App.css';

interface State {
  friendIndex: number;
  docIndex: number;
  edIndex: number;
  fit: boolean;
  showGuides: boolean;
  maskBleed: boolean;
}

export default class App extends React.Component<{}, State> {
  public state = {
    friendIndex: 0,
    docIndex: 0,
    edIndex: 0,
    fit: true,
    showGuides: false,
    maskBleed: true,
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
      title: doc.title,
      printSize: ed.defaultSize,
      pages: ed.pages[ed.defaultSize],
      edition: ed.type,
      blurb: blurb(doc, friend),
      isbn: '978-1-64476-015-4', // @TODO temp hard-coded during dev
      showGuides,
    };
  }

  public render(): JSX.Element {
    const { friendIndex, docIndex, edIndex, fit, showGuides, maskBleed } = this.state;
    const coverProps = this.coverProps();
    return (
      <div className={`App web trim--${coverProps ? coverProps.printSize : 'm'}`}>
        <form
          autoComplete="off"
          style={{ padding: '1em', marginBottom: '2em', display: 'flex' }}
        >
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

        {coverProps && (
          <div className="cover-wrap">
            <Cover {...coverProps} />
            <div className="cover-mask" />
            <style>
              {coverCss(coverProps, fitScaler(coverProps, fit))}
              {maskBleed
                ? '.guide--trim-bleed { opacity: 0 }'
                : '.cover-mask { display: none }'}
            </style>
          </div>
        )}
        <Toolbar
          fit={fit}
          maskBleed={maskBleed}
          showGuides={showGuides}
          toggleFit={() => this.setState({ fit: !fit })}
          toggleShowGuides={() => this.setState({ showGuides: !showGuides })}
          toggleMaskBleed={() => this.setState({ maskBleed: !maskBleed })}
          coverProps={coverProps}
        />
      </div>
    );
  }
}
