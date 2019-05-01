import React from 'react';
import Cover from './Cover/Cover';
import { coverCss, cssVars } from './Cover/css';
import './App.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import FitIcon from '@material-ui/icons/SettingsOverscan';
import GuidesIcon from '@material-ui/icons/BorderClear';
import MaskBleedIcon from '@material-ui/icons/BorderStyle';
import { CoverProps, FriendData } from './Cover/types';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

// @ts-ignore
const friendData = window.Friends as FriendData;

type Friend = FriendData[0];
type Document = Friend['documents'][0];
type Edition = Document['editions'][0];

function makePdf(props: CoverProps): void {
  fetch(`http://localhost:9988`, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });
}

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
    let stored: State | null = null;
    try {
      stored = JSON.parse(localStorage.getItem('state') || 'null');
    } catch {}

    if (stored) {
      this.setState({ ...this.state, ...stored });
    }

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
            <InputLabel htmlFor="friend">Friend</InputLabel>
            <Select
              onChange={e => {
                this.setState({
                  friendIndex: Number(e.target.value),
                  docIndex: 0,
                  edIndex: 0,
                });
              }}
              value={friendIndex}
            >
              <MenuItem value="-1">None</MenuItem>
              {friendData.map((friend, i) => (
                <MenuItem key={friend.name} value={i}>
                  {friend.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ flexGrow: 1, marginRight: '1em' }}>
            <InputLabel htmlFor="friend">Document</InputLabel>
            <Select
              onChange={e => {
                this.setState({
                  docIndex: Number(e.target.value),
                  edIndex: 0,
                });
              }}
              value={docIndex}
            >
              <MenuItem value="-1">None</MenuItem>
              {documents(friendIndex).map((doc, i) => (
                <MenuItem key={doc.title} value={i}>
                  {doc.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ minWidth: 140 }}>
            <InputLabel htmlFor="friend">Edition</InputLabel>
            <Select
              onChange={e => this.setState({ edIndex: Number(e.target.value) })}
              value={edIndex}
            >
              <MenuItem value="-1">None</MenuItem>
              {editions(friendIndex, docIndex).map((ed, i) => (
                <MenuItem key={ed.type} value={i}>
                  {ed.type}
                </MenuItem>
              ))}
            </Select>
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
        <AppBar
          style={{
            position: 'fixed',
            bottom: 0,
            top: 'auto',
            backgroundColor: 'white',
          }}
        >
          <Toolbar>
            <IconButton
              style={fit ? selected : {}}
              onClick={() => this.setState({ fit: !fit })}
            >
              <FitIcon />
            </IconButton>
            &nbsp;&nbsp;
            <IconButton
              style={maskBleed ? selected : {}}
              onClick={() => this.setState({ maskBleed: !maskBleed })}
            >
              <MaskBleedIcon />
            </IconButton>
            &nbsp;&nbsp;
            <IconButton
              style={showGuides ? selected : {}}
              onClick={() => this.setState({ showGuides: !showGuides })}
            >
              <GuidesIcon />
            </IconButton>
            {coverProps && (
              <>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  style={{ float: 'right' }}
                  onClick={() => makePdf(coverProps)}
                >
                  <PdfIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const selected = { color: 'rgb(133, 75, 94)', background: '#efefef' };

function fitScaler(props: CoverProps, fit: boolean): number | undefined {
  const webScaler = 1.1358;
  if (!fit) {
    return webScaler;
  }

  const windowWidth = window.innerWidth / 96;
  const coverWidth = Number(cssVars(props).coverWidth.replace(/in$/, '')) * webScaler;
  if (coverWidth <= windowWidth) {
    return webScaler;
  }

  const shrinker = windowWidth / coverWidth - 0.015;
  return webScaler * shrinker;
}

function documents(friendIndex: number): Document[] {
  if (friendData[friendIndex]) {
    return friendData[friendIndex].documents;
  }
  return [];
}

function editions(friendIndex: number, docIndex: number): Edition[] {
  if (!friendData[friendIndex]) {
    return [];
  }
  if (!friendData[friendIndex].documents[docIndex]) {
    return [];
  }
  return friendData[friendIndex].documents[docIndex].editions;
}

function blurb(doc: Document, friend: Friend): string {
  let blurb = doc.description || friend.description;
  if (blurb !== 'TODO') return blurb;
  return `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;
}
