import React from 'react';
import ChoiceStep from './ChoiceStep';

const Downloading: React.FC = () => (
  <ChoiceStep title="Download">
    <p className="p-8 body-text text-white text-center bg-flblue-700">
      Your download should begin shortly.
    </p>
  </ChoiceStep>
);

export default Downloading;
