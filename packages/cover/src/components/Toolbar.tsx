import React from 'react';
import { CoverProps } from '@friends-library/types';
import MaterialUiToolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import FitIcon from '@material-ui/icons/SettingsOverscan';
import GuidesIcon from '@material-ui/icons/BorderClear';
import MaskBleedIcon from '@material-ui/icons/BorderStyle';
import ThreeDIcon from '@material-ui/icons/FilterNone';
import { makePdf } from './utils';
import './Toolbar.css';

interface Props {
  fit: boolean;
  maskBleed: boolean;
  showGuides: boolean;
  threeD: boolean;
  toggleThreeD: () => void;
  toggleFit: () => void;
  toggleMaskBleed: () => void;
  toggleShowGuides: () => void;
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
  threeD,
  toggleThreeD,
}) => (
  <AppBar className="Toolbar">
    <MaterialUiToolbar>
      <IconButton style={fit ? selected : {}} onClick={() => toggleFit()}>
        <FitIcon />
      </IconButton>
      <IconButton
        disabled={threeD}
        style={maskBleed && !threeD ? selected : {}}
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
      <IconButton className={threeD ? 'selected' : ''} onClick={() => toggleThreeD()}>
        <ThreeDIcon />
      </IconButton>
      {coverProps && (
        <p className="book-stats">
          <span>
            book size: <code>{coverProps.printSize.toUpperCase()}</code>
          </span>
          <span>
            pages: <code>~{coverProps.pages}</code>
          </span>
        </p>
      )}
      {coverProps && process.env.NODE_ENV === 'development' && (
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
