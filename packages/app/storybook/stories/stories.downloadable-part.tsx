import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { DownloadablePart } from '../../components/DownloadablePart';

const fns = {
  download: () => {},
  play: () => {},
};

storiesOf(`DownloadablePart`, module).add(`multi`, () => (
  <View>
    <DownloadablePart {...fns} part={{ title: `Chapter 2` }} state="playing" />
    <DownloadablePart {...fns} part={{ title: `Chapter 2` }} state="downloaded" />
    <DownloadablePart
      {...fns}
      part={{ title: `Chapter 3` }}
      state="downloading"
      progress={33}
    />
    <DownloadablePart
      {...fns}
      part={{ title: `Chapter 4` }}
      state="queued_for_download"
    />
    <DownloadablePart {...fns} part={{ title: `Chapter 5` }} state="not_downloaded" />
    <DownloadablePart {...fns} part={{ title: longTitle }} state="playing" />
    <DownloadablePart {...fns} part={{ title: longTitle }} state="downloaded" />
    <DownloadablePart
      {...fns}
      part={{ title: longTitle }}
      state="downloading"
      progress={66}
    />
    <DownloadablePart {...fns} part={{ title: longTitle }} state="queued_for_download" />
  </View>
));

const longTitle = `Section 1 - Tender Advice, Caution, and Counsel to Parents and Children`;
