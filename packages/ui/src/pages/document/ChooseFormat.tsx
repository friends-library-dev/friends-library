import React from 'react';
import ChoiceStep from './ChoiceStep';
import ChoiceItem from './ChoiceItem';
import Ebook from '../../icons/Ebook';
import Pdf from '../../icons/Pdf';

interface Props {
  onChoose: (choice: 'ebook' | 'pdf') => any;
}
const ChooseFormat: React.FC<Props> = ({ onChoose }) => (
  <ChoiceStep title="Choose Book Type">
    <ChoiceItem
      label="E-Book"
      description="Best for reading on a computer, phone, or tablet."
      recommended
      Icon={Ebook}
      onChoose={() => onChoose('ebook')}
    />
    <ChoiceItem
      label="PDF"
      description="Best for printing out your own copy."
      Icon={Pdf}
      onChoose={() => onChoose('pdf')}
    />
  </ChoiceStep>
);

export default ChooseFormat;
