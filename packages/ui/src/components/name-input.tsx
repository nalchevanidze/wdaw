import * as React from 'react';

type Props = {
  value: string;
  onChange(i: string): void;
};

export const NameInput: React.FC<Props> = ({  value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(value);

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
          <input
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
