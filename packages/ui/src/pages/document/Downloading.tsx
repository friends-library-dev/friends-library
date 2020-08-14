import React from 'react';
import Dual from '../../Dual';
import ChoiceStep from './ChoiceStep';

const Downloading: React.FC = () => (
  <ChoiceStep title="Download">
    <Dual.P className="p-8 body-text text-white text-center bg-flblue-700">
      <>Your download should begin shortly.</>
      <>Tu descarga debería comenzar en breve.</>
    </Dual.P>
  </ChoiceStep>
);

export default Downloading;
