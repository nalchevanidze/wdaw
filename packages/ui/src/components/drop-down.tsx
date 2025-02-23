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
}) => {
  const id = React.useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={label}
        value={value}
        onChange={({ target }) => {
          onChange(target.value);
        }}
      >
        {options.map(({ name, id }) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
    </div>
  );
};
