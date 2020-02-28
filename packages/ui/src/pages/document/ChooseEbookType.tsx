import React from 'react';
import ChoiceStep from './ChoiceStep';
import ChoiceItem from './ChoiceItem';
import Epub from '../../icons/Epub';
import Mobi from '../../icons/Mobi';

interface Props {
  recommendation: 'epub' | 'mobi';
  onChoose: (choice: 'epub' | 'mobi') => any;
}

const ChooseFormat: React.FC<Props> = ({ recommendation, onChoose }) => {
  const formats = {
    epub: {
      label: 'E-Pub',
      description: 'Best for most apps and platforms, including iOS.',
      Icon: Epub,
      choice: 'epub' as const,
    },
    mobi: {
      label: 'Mobi',
      description: 'Best on Amazon devices, Kindle app, and Android.',
      Icon: Mobi,
      choice: 'mobi' as const,
    },
  };
  const recommended = formats[recommendation];
  const discouraged = formats[recommendation === 'epub' ? 'mobi' : 'epub'];
  return (
    <ChoiceStep title="Choose eBook Type">
      <ChoiceItem
        label={recommended.label}
        description={recommended.description}
        recommended
        Icon={recommended.Icon}
        onChoose={() => onChoose(recommended.choice)}
      />
      <ChoiceItem
        label={discouraged.label}
        description={discouraged.description}
        Icon={discouraged.Icon}
        onChoose={() => onChoose(discouraged.choice)}
      />
    </ChoiceStep>
  );
};

export default ChooseFormat;
