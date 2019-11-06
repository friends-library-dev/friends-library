import React from 'react';
import { CoverProps } from '@friends-library/types';
import MaterialUiToolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import FitIcon from '@material-ui/icons/SettingsOverscan';
import GuidesIcon from '@material-ui/icons/BorderClear';
import CodeIcon from '@material-ui/icons/Code';
import MaskBleedIcon from '@material-ui/icons/BorderStyle';
import ThreeDIcon from '@material-ui/icons/Looks3';
import TwoDIcon from '@material-ui/icons/LooksTwo';
import EbookIcon from '@material-ui/icons/PhoneIphone';
import ReplayIcon from '@material-ui/icons/Replay';
import { makePdf } from './utils';
import { Mode } from './App';
import './Toolbar.css';

interface Props {
  fit: boolean;
  maskBleed: boolean;
  showGuides: boolean;
  mode: Mode;
  showCode: boolean;
  cycleMode: () => void;
  toggleShowCode: () => void;
  toggleFit: () => void;
  toggleMaskBleed: () => void;
  toggleShowGuides: () => void;
  spinCover: () => void;
  coverProps: CoverProps | undefined;
}

const Toolbar: React.FC<Props> = ({
  fit,
  maskBleed,
  showGuides,
  toggleFit,
  toggleMaskBleed,
  toggleShowGuides,
  coverProps,
  spinCover,
  mode,
  toggleShowCode,
  showCode,
  cycleMode,
}) => (
  <AppBar className="Toolbar">
    <MaterialUiToolbar>
      <IconButton style={fit ? selected : {}} onClick={() => toggleFit()}>
        <FitIcon />
      </IconButton>
      <IconButton
        disabled={mode !== 'pdf'}
        style={maskBleed && mode === 'pdf' ? selected : {}}
        onClick={() => toggleMaskBleed()}
      >
        <MaskBleedIcon />
      </IconButton>
      <IconButton
        className={showGuides ? 'selected' : ''}
        onClick={() => toggleShowGuides()}
      >
        <GuidesIcon />
      </IconButton>
      <IconButton onClick={() => cycleMode()}>
        {mode === '3d' ? <ThreeDIcon /> : mode === 'pdf' ? <TwoDIcon /> : <EbookIcon />}
      </IconButton>
      <IconButton className={showCode ? 'selected' : ''} onClick={() => toggleShowCode()}>
        <CodeIcon />
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
          <IconButton onClick={spinCover}>
            <ReplayIcon />
          </IconButton>
        </>
      )}
      {coverProps && process.env.NODE_ENV === 'development' && mode !== 'ebook' && (
        <>
          <IconButton onClick={() => makePdf(coverProps)}>
            <PdfIcon />
          </IconButton>
        </>
      )}
    </MaterialUiToolbar>
  </AppBar>
);

export default Toolbar;

const selected = { color: 'rgb(133, 75, 94)', background: '#efefef' };
