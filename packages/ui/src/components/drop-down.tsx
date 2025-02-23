import * as React from 'react';

type Props = {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange(i: string): void;
};

export const DropDown: React.FC<Props> = ({
  label,
  value,
  options,
  onChange
}) => (
  <div>
    <label htmlFor="midi-fragment">{label}</label>
    <select
      id="midi-fragment"
      name="fragments"
      value={value}
      onChange={({ target }) => {
        onChange(target.value);
      }}
    >
      {options.map(({ name, id }) => (
        <option value={id}>{name}</option>
      ))}
    </select>
  </div>
);
