import React from 'react';
import PopUnder from '../../PopUnder';

interface Props {
  top?: number;
  left?: number;
}

const ChoiceWizard: React.FC<Props> = ({ top, left, children }) => (
  <PopUnder
    className="ChoiceWizard z-50 top-0 left-0"
    style={{
      width: `22rem`,
      maxWidth: `100vw`,
      top: top || 0,
      left: left || 0,
      position: `absolute`,
      transform: `translateX(-50%)`,
    }}
    tailwindBgColor="flblue"
  >
    {children}
  </PopUnder>
);

export default ChoiceWizard;
