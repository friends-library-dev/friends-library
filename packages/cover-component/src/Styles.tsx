import React from 'react';
import * as css from './css';

const CoverWebStylesAllStatic: React.FC = () => (
  <style className="cover-styles">{`${minifyCss(css.allStatic())}`}</style>
);

const CoverWebStylesAllDynamic: React.FC<{ scaler?: number; scope?: string }> = ({
  scaler,
  scope,
}) => <style>{`${minifyCss(css.allDynamic(scaler, scope))}`}</style>;

const CoverWebStylesSizes: React.FC = () => (
  <>
    <CoverWebStylesAllDynamic scaler={1} scope="full" />
    <CoverWebStylesAllDynamic scaler={3 / 5} scope="3-5" />
    <CoverWebStylesAllDynamic scaler={4 / 5} scope="4-5" />
    <CoverWebStylesAllDynamic scaler={1 / 2} scope="1-2" />
    <CoverWebStylesAllDynamic scaler={1 / 3} scope="1-3" />
    <CoverWebStylesAllDynamic scaler={1 / 4} scope="1-4" />
    <style className="cover-styles">
      {minifyCss(`
      .Cover.Cover--3d.Cover--scope-3-5 { perspective: 1200px; }
      .Cover.Cover--3d.Cover--scope-1-2 { perspective: 1000px; }
      .Cover.Cover--3d.Cover--scope-1-3 { perspective: 800px; }
      .Cover.Cover--3d.Cover--scope-1-4 { perspective: 600px; }
    `)}
    </style>
  </>
);

export { CoverWebStylesAllStatic, CoverWebStylesAllDynamic, CoverWebStylesSizes };

function minifyCss(css: string): string {
  return css
    .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, ``)
    .replace(/ {2,}/g, ` `)
    .replace(/ ([{:}]) /g, `$1`)
    .replace(/([;,]) /g, `$1`)
    .replace(/ !/g, `!`);
}
