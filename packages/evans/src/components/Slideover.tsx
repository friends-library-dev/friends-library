import React from 'react';
import { SlideoverMenu } from '@friends-library/ui';
import './Slideover.css';

interface Props {
  close: () => void;
}

const Slideover: React.FC<Props> = ({ close }) => (
  <div className="Slideover fixed overflow-hidden overflow-y-auto h-full">
    <SlideoverMenu onClose={close} />
  </div>
);

export default Slideover;
