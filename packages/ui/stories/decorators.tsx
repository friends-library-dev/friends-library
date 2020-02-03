import React from 'react';
import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';

export function coverSizes(storyFn: any): JSX.Element {
  return (
    <>
      {storyFn()}
      <CoverWebStylesAllStatic />
      <CoverWebStylesSizes />
    </>
  );
}
