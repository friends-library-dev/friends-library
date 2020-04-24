import React from 'react';
import { AccordionItem, AccordionButton, AccordionPanel } from '@reach/accordion';
import { t } from '@friends-library/locale';
import PillDropdownDropdown from '../../PillDropdownDropdown';
import Item from '../../PillDropdownItem';
import { LANG } from '../../env';
import './FilterSelectDropdown.css';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterSelectDropdown: React.FC<Props> = props => (
  <PillDropdownDropdown className="FilterSelectDropdown" accordion>
    {LANG === 'en' && (
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
    )}
    <AccordionItem className="capitalize">
      <Category label={t`Tags`} />
      <AccordionPanel>
        <Option value="tag.journal" {...props}>
          {t`journal`}
        </Option>
        <Option value="tag.letters" {...props}>
          {t`letters`}
        </Option>
        <Option value="tag.exhortation" {...props}>
          {t`exhortation`}
        </Option>
        <Option value="tag.doctrinal" {...props}>
          {t`doctrinal`}
        </Option>
        <Option value="tag.treatise" {...props}>
          {t`treatise`}
        </Option>
        <Option value="tag.history" {...props}>
          {t`history`}
        </Option>
        <Option value="tag.allegory" {...props}>
          {t`allegory`}
        </Option>
        <Option value="tag.devotional" {...props}>
          {t`spiritual life`}
        </Option>
      </AccordionPanel>
    </AccordionItem>
    {LANG === 'en' && (
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
    )}
    {LANG === 'en' && (
      <AccordionItem className="border-b">
        <Category label="Region" />
        <AccordionPanel>
          <Option value="region.england" {...props}>
            England
          </Option>
          <Option value="region.ireland" {...props}>
            Ireland
          </Option>
          <Option value="region.eastern-us" {...props}>
            Eastern US
          </Option>
          <Option value="region.western-us" {...props}>
            Western US
          </Option>
          <Option value="region.scotland" {...props}>
            Scotland
          </Option>
          <Option value="region.other" {...props}>
            Other
          </Option>
        </AccordionPanel>
      </AccordionItem>
    )}
  </PillDropdownDropdown>
);

export default FilterSelectDropdown;

const Option: React.FC<Props & { value: string }> = ({
  children,
  value,
  selected,
  setSelected,
}) => {
  const isSelected = selected.includes(value);
  return (
    <Item
      selected={isSelected}
      onClick={e => {
        setSelected(
          isSelected
            ? selected.filter(existing => existing !== value)
            : addFilter(value, selected),
        );
        e.stopPropagation();
      }}
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

/**
 * Tags are the only filter type that can have more than one selected at a time
 */
function addFilter(toAdd: string, current: string[]): string[] {
  const toAddType = toAdd.split('.')[0];
  if (toAddType === 'tag') {
    return current.concat(toAdd);
  }
  return current
    .filter(existing => {
      const existingType = existing.split('.')[0];
      return existingType !== toAddType;
    })
    .concat([toAdd]);
}
