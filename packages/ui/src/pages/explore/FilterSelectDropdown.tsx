import React from 'react';
import cx from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@reach/accordion';
import './FilterSelectDropdown.css';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterSelectDropdown: React.FC<Props> = props => {
  return (
    <Accordion className="FilterSelectDropdown relative mt-3 w-64 py-4 rounded-lg bg-flgray-100 antialiased text-flgray-100 shadow-direct">
      <AccordionItem className="border-tx">
        <Category label="Editions" />
        <AccordionPanel>
          <Option value="edition.updated" {...props}>
            Updated
          </Option>
          <Option value="edition.modernized" {...props}>
            Modernized
          </Option>
          <Option value="edition.original" {...props}>
            Original
          </Option>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Category label="Tags" />
        <AccordionPanel>
          <Option value="tag.journal" {...props}>
            Journal
          </Option>
          <Option value="tag.letters" {...props}>
            Letters
          </Option>
          <Option value="tag.exhortation" {...props}>
            Exhortation
          </Option>
          <Option value="tag.doctrinal" {...props}>
            Doctrinal
          </Option>
          <Option value="tag.treatise" {...props}>
            Treatise
          </Option>
          <Option value="tag.history" {...props}>
            History
          </Option>
          <Option value="tag.allegory" {...props}>
            Allegory
          </Option>
          <Option value="tag.devotional" {...props}>
            Devotional
          </Option>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Category label="Time Period" />
        <AccordionPanel>
          <Option value="period.early" {...props}>
            Early
            <span className="uppercase text-xs pl-2 text-flgray-500">(1650-1725)</span>
          </Option>
          <Option value="period.mid" {...props}>
            Mid
            <span className="uppercase text-xs pl-2 text-flgray-500">(1725-1815)</span>
          </Option>
          <Option value="period.late" {...props}>
            Late
            <span className="uppercase text-xs pl-2 text-flgray-500">(1815-1895)</span>
          </Option>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className="border-b">
        <Category label="Region" />
        <AccordionPanel>
          <Option value="region.england" {...props}>
            England
          </Option>
          <Option value="region.ireland" {...props}>
            Ireland
          </Option>
          <Option value="region.us" {...props}>
            America
          </Option>
          <Option value="region.scotland" {...props}>
            Scotland
          </Option>
          <Option value="region.other" {...props}>
            Other
          </Option>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterSelectDropdown;

const Item: React.FC<{ className?: string; onClick?: (e: React.MouseEvent) => any }> = ({
  children,
  className,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={cx(
      className,
      'FilterSelectDropdown__Item p-3',
      'font-sans tracking-wide text-flgray-500 text-center cursor-pointer',
    )}
  >
    {children}
  </div>
);

const Option: React.FC<Props & { value: string }> = ({
  children,
  value,
  selected,
  setSelected,
}) => {
  const isSelected = selected.includes(value);
  return (
    <Item
      onClick={e => {
        setSelected(
          isSelected
            ? selected.filter(existing => existing !== value)
            : selected.concat(value),
        );
        e.stopPropagation();
      }}
      className={cx(
        isSelected ? 'bg-flgray-300 hover:bg-flgray-400' : 'bg-white hover:bg-gray-200',
        'hover:text-flgray-500 select-none',
      )}
    >
      {children}
      {isSelected && (
        <i
          className="fa fa-times-circle text-lg text-flgray-400 pl-2 -mr-3"
          style={{ transform: 'translateY(1px)' }}
        />
      )}
    </Item>
  );
};

const Category: React.FC<{ label: string }> = ({ label }) => (
  <AccordionButton className="block w-full focus:outline-none">
    <Item className="bg-flgray-100">
      <span className="pr-2">{label}</span>
      <i className="-mr-2 fa fa-chevron-down text-flgray-400" />
      <i className="-mr-2 fa fa-chevron-up text-flgray-400" />
    </Item>
  </AccordionButton>
);
