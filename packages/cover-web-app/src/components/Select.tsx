import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialUiSelect from '@material-ui/core/Select';

interface Props {
  label: string;
  value: number;
  options: string[];
  onChange: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => void;
}

const Select: React.FC<Props> = ({ label, value, options, onChange }) => (
  <>
    <InputLabel htmlFor="friend">{label}</InputLabel>
    <MaterialUiSelect onChange={onChange} value={value}>
      <MenuItem value="-1">None</MenuItem>
      {options.map((opt, i) => (
        <MenuItem key={opt} value={i}>
          {opt}
        </MenuItem>
      ))}
    </MaterialUiSelect>
  </>
);

export default Select;
