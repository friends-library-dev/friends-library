import React from 'react';
import Link from 'gatsby-link';
import { Diamonds } from '@friends-library/cover-component';
import ChoiceStep from './ChoiceStep';
import ChoiceItem from './ChoiceItem';
import { EditionType } from '@friends-library/types';

interface Props {
  editions: EditionType[];
  onSelect: (selected: EditionType) => any;
}

const ChooseEdition: React.FC<Props> = ({ editions, onSelect }) => (
  <ChoiceStep title="Choose an Edition">
    {editions.includes(`updated`) && (
      <ChoiceItem
        label="Updated"
        description="Our most readable edition"
        onChoose={() => onSelect(`updated`)}
        recommended
        Icon={Diamonds.updated}
      />
    )}
    {editions.includes(`modernized`) && (
      <ChoiceItem
        label="Modern"
        description="Modern grammar and vocabulary"
        recommended={!editions.includes(`updated`)}
        onChoose={() => onSelect(`modernized`)}
        Icon={Diamonds.modernized}
      />
    )}
    {editions.includes(`original`) && (
      <ChoiceItem
        label="Original"
        description="Original grammar and vocabulary"
        onChoose={() => onSelect(`original`)}
        Icon={Diamonds.original}
      />
    )}
    <div className="flex flex-col items-center">
      <Link
        to="/editions"
        className="inline-block pb-1 mt-8 opacity-75 border-flblue-700 border-b-4"
      >
        Learn more about editions
      </Link>
    </div>
  </ChoiceStep>
);

export default ChooseEdition;
