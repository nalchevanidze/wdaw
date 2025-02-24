import * as React from 'react';

type Props = {
  label: string;
  value: string;
  id: string;
  options: { id: string; name: string }[];
  onChange(i: string): void;
};

export const DropDown: React.FC<Props> = ({
  id,
  label,
  value,
  options,
  onChange
}) => (
  <div>
    <label htmlFor={id}>{label}: </label>
    <select
      id={id}
      name={label}
      value={value}
      onChange={({ target }) => onChange(target.value)}
    >
      {options.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  </div>
);
