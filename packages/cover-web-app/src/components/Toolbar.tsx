import React from 'react';
import { CoverProps } from '@friends-library/types';
import MaterialUiToolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import GuidesIcon from '@material-ui/icons/BorderClear';
import CodeIcon from '@material-ui/icons/Code';
import MaskBleedIcon from '@material-ui/icons/BorderStyle';
import ThreeDIcon from '@material-ui/icons/Looks3';
import TwoDIcon from '@material-ui/icons/LooksTwo';
import EbookIcon from '@material-ui/icons/PhoneIphone';
import ReplayIcon from '@material-ui/icons/Replay';
import { makePdf } from './utils';
import { Mode, Scale, BookSize } from './App';
import './Toolbar.css';

interface Props {
  scale: Scale;
  fauxVol?: 1 | 2;
  maskBleed: boolean;
  showGuides: boolean;
  mode: Mode;
  showCode: boolean;
  bookSize: BookSize;
  cycleBookSize: () => void;
  cycleMode: () => void;
  cycleFauxVol: () => void;
  toggleShowCode: () => void;
  cycleScale: () => void;
  toggleMaskBleed: () => void;
  toggleShowGuides: () => void;
  spinCover: () => void;
  coverProps: CoverProps | undefined;
}

const Toolbar: React.FC<Props> = ({
  scale,
  maskBleed,
  showGuides,
  cycleScale,
  toggleMaskBleed,
  toggleShowGuides,
  coverProps,
  spinCover,
  mode,
  toggleShowCode,
  showCode,
  cycleMode,
  fauxVol,
  cycleFauxVol,
  bookSize,
  cycleBookSize,
}) => (
  <AppBar className="Toolbar">
    <MaterialUiToolbar>
      <IconButton
        title="mask bleed"
        disabled={mode !== 'pdf'}
        style={maskBleed && mode === 'pdf' ? selected : {}}
        onClick={toggleMaskBleed}
      >
        <MaskBleedIcon />
      </IconButton>
      <IconButton
        title="show guides"
        className={showGuides ? 'selected' : ''}
        onClick={toggleShowGuides}
      >
        <GuidesIcon />
      </IconButton>
      <IconButton title="mode" onClick={cycleMode}>
        {mode === '3d' ? <ThreeDIcon /> : mode === 'pdf' ? <TwoDIcon /> : <EbookIcon />}
      </IconButton>
      <IconButton
        title="toggle custom code"
        className={showCode ? 'custom-code selected' : 'custom-code'}
        onClick={toggleShowCode}
      >
        <CodeIcon />
      </IconButton>
      <IconButton onClick={cycleScale} title={`scale: ${scale}`}>
        <TextButton>{scaleChar(scale)}</TextButton>
      </IconButton>
      <IconButton onClick={cycleFauxVol} title={`faux vol. num: ${fauxVol}`}>
        <TextButton>{fauxVolDisplay(fauxVol)}</TextButton>
      </IconButton>
      <IconButton
        onClick={cycleBookSize}
        title={bookSize === 'actual' ? 'actual size' : `forced size: ${bookSize}`}
      >
        <TextButton>{bookSizeDisplay(bookSize)}</TextButton>
      </IconButton>
      {coverProps && mode !== 'ebook' && (
        <p className="book-stats">
          <span>
            size: <code>{coverProps.size.toUpperCase()}</code>
          </span>
          <span>
            pages: <code>~{coverProps.pages}</code>
          </span>
          <span>
            blurb: <code>{coverProps.blurb.length}</code>
          </span>
        </p>
      )}
      {coverProps && mode === '3d' && (
        <>
          <IconButton onClick={spinCover} title="spin cover">
            <ReplayIcon />
          </IconButton>
        </>
      )}
      {coverProps && process.env.NODE_ENV === 'development' && mode !== 'ebook' && (
        <>
          <IconButton onClick={() => makePdf(coverProps)} title="create pdf">
            <PdfIcon />
          </IconButton>
        </>
      )}
    </MaterialUiToolbar>
  </AppBar>
);

export default Toolbar;

const selected = { color: 'rgb(133, 75, 94)', background: '#efefef' };

function scaleChar(scale: Scale): string {
  const map: Record<Scale, string> = {
    fit: 'f',
    '1': '1',
    '1-2': '½',
    '1-3': '⅓',
    '1-4': '¼',
    '3-5': '⅗',
    '4-5': '⅘',
  };
  return map[scale];
}

function fauxVolDisplay(fauxVol: undefined | 1 | 2): string {
  if (!fauxVol) return '~';
  return `v${fauxVol}`;
}

function bookSizeDisplay(bookSize: BookSize): string {
  if (bookSize === 'actual') {
    return '•';
  }
  return bookSize;
}

const TextButton: React.FC = ({ children }) => (
  <span style={{ fontWeight: 'bold', width: 22, fontFamily: 'monospace' }}>
    {children}
  </span>
);
