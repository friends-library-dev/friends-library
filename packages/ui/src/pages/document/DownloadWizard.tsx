import React, { useState, useEffect } from 'react';
import { EditionType } from '@friends-library/types';
import ChoiceWizard from './ChoiceWizard';
import ChooseEdition from './ChooseEdition';
import ChooseFormat from './ChooseFormat';
import ChooseEbookType from './ChooseEbookType';
import Downloading from './Downloading';

interface Props {
  editions: EditionType[];
  eBookTypeRecommendation: 'epub' | 'mobi';
  onSelect: (edition: EditionType, type: 'web_pdf' | 'epub' | 'mobi') => any;
  top?: number;
  left?: number;
}

const DownloadWizard: React.FC<Props> = ({
  editions,
  eBookTypeRecommendation,
  onSelect,
  top,
  left,
}) => {
  const initialEdition = editions.length === 1 ? editions[0] : undefined;
  const [edition, setEdition] = useState<EditionType | undefined>(initialEdition);
  const [format, setFormat] = useState<'ebook' | 'pdf' | undefined>();
  const [eBookType, setEBookType] = useState<'epub' | 'mobi' | undefined>();
  const selectionComplete = edition && format && (format === 'pdf' || eBookType);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  useEffect(() => {
    if (selectionComplete && !downloaded) {
      setDownloaded(true);
      onSelect(edition || 'updated', eBookType || 'web_pdf');
    }
  }, [edition, format, eBookType, downloaded, onSelect, selectionComplete]);

  return (
    <ChoiceWizard top={top} left={left}>
      {edition === undefined && (
        <ChooseEdition editions={editions} onSelect={setEdition} />
      )}
      {edition && !format && <ChooseFormat onChoose={setFormat} />}
      {edition && format && format !== 'pdf' && !eBookType && (
        <ChooseEbookType
          recommendation={eBookTypeRecommendation}
          onChoose={setEBookType}
        />
      )}
      {selectionComplete && <Downloading />}
    </ChoiceWizard>
  );
};

export default DownloadWizard;
