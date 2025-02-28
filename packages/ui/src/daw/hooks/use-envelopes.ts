import * as React from 'react';
import { usePreset } from './use-preset';
import { ENVELOPE } from '../../state/types';



export const useEnvelope = () => {
  const { envelopes, setEnvelope } = usePreset();

  const [id, setId] = React.useState<ENVELOPE>('gain');

  const options = Object.keys(envelopes).map((name) => ({
    name,
    active: name === id,
    onclick: () => setId(name as ENVELOPE)
  }));

  return { id, current: envelopes[id], options, setFields: setEnvelope(id) };
};
