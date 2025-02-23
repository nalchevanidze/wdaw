import * as React from 'react';

type Props = {
  label: string;
  value: string;
  onChange(i: string): void;
};

export const TextInput: React.FC<Props> = ({ label, value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(value);
  const id = React.useId();

  React.useEffect(() => {
    setText(value);
  }, [value]);

  const ok = () => {
    onChange(text);
    setOpen(false);
  };

  return (
    <div>
      {!open && <button onClick={() => setOpen(true)}> Rename </button>}
      {open && (
        <>
          <label htmlFor={id}>{label}: </label>
          <input
            id={id}
            type="text"
            value={text}
            onChange={({ target }) => setText(target.value)}
          />
          <button onClick={ok}> Ok </button>
        </>
      )}
    </div>
  );
};
