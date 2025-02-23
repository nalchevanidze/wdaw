import * as React from 'react';

type Props = {
  label: string;
  value: string;
  onChange(i: string): void;
};

export const TextInput: React.FC<Props> = ({ label, value, onChange }) => (
  <div>
    <label htmlFor="track-name">{label}: </label>
    <input
      id="track-name"
      type="text"
      value={value}
      onChange={({ target }) => onChange(target.value)}
    />
  </div>
);
