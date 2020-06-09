import React from 'react';
import { t } from '@friends-library/locale';
import ChoiceStep from './ChoiceStep';
import ChoiceItem from './ChoiceItem';
import Ebook from '../../icons/Ebook';
import Pdf from '../../icons/Pdf';

interface Props {
  onChoose: (choice: 'ebook' | 'pdf') => any;
}
const ChooseFormat: React.FC<Props> = ({ onChoose }) => (
  <ChoiceStep title={t`Choose Book Type`}>
    <ChoiceItem
      label={t`E-Book`}
      description={t`Best for reading on a computer, phone, or tablet.`}
      recommended
      Icon={Ebook}
      onChoose={() => onChoose(`ebook`)}
    />
    <ChoiceItem
      label="PDF"
      description={t`Best for printing out your own copy.`}
      Icon={Pdf}
      onChoose={() => onChoose(`pdf`)}
    />
  </ChoiceStep>
);

export default ChooseFormat;
