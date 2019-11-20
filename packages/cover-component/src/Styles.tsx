import React from 'react';
import * as css from './css';

const CoverWebStylesAllStatic: React.FC = () => <style>{`${css.allStatic()}`}</style>;

const CoverWebStylesAllDynamic: React.FC<{ scaler?: number; scope?: string }> = ({
  scaler,
  scope,
}) => <style>{`${css.allDynamic(scaler, scope)}`}</style>;

const CoverWebStylesSizes: React.FC = () => (
  <>
    <CoverWebStylesAllDynamic scaler={1} scope="full" />
    <CoverWebStylesAllDynamic scaler={3 / 5} scope="3-5" />
  </>
);

export { CoverWebStylesAllStatic, CoverWebStylesAllDynamic, CoverWebStylesSizes };
