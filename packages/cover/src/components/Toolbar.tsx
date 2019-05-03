import React from 'react';
import MaterialUiToolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import FitIcon from '@material-ui/icons/SettingsOverscan';
import GuidesIcon from '@material-ui/icons/BorderClear';
import MaskBleedIcon from '@material-ui/icons/BorderStyle';
import ThreeDIcon from '@material-ui/icons/FilterNone';
import { CoverProps } from './Cover/types';
import { makePdf } from './utils';

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
  <AppBar
    style={{
      backgroundColor: 'white',
      position: 'static',
    }}
  >
    <MaterialUiToolbar>
      <IconButton style={fit ? selected : {}} onClick={() => toggleFit()}>
        <FitIcon />
      </IconButton>
      &nbsp;&nbsp;
      <IconButton
        disabled={threeD}
        style={maskBleed && !threeD ? selected : {}}
        onClick={() => toggleMaskBleed()}
      >
        <MaskBleedIcon />
      </IconButton>
      &nbsp;&nbsp;
      <IconButton style={showGuides ? selected : {}} onClick={() => toggleShowGuides()}>
        <GuidesIcon />
      </IconButton>
      &nbsp;&nbsp;
      <IconButton style={threeD ? selected : {}} onClick={() => toggleThreeD()}>
        <ThreeDIcon />
      </IconButton>
      {coverProps && process.env.NODE_ENV === 'development' && (
        <>
          <div style={{ flexGrow: 1 }} />
          <IconButton style={{ float: 'right' }} onClick={() => makePdf(coverProps)}>
            <PdfIcon />
          </IconButton>
        </>
      )}
    </MaterialUiToolbar>
  </AppBar>
);

export default Toolbar;

const selected = { color: 'rgb(133, 75, 94)', background: '#efefef' };
