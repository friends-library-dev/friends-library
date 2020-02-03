import React from 'react';
import { SlideoverMenu } from '@friends-library/ui';
import './Slideover.css';

interface Props {
  close: () => void;
}

export default ({ close }: Props) => (
  <div className="Slideover fixed overflow-hidden overflow-y-auto h-full">
    <SlideoverMenu onClose={close} />
  </div>
);
