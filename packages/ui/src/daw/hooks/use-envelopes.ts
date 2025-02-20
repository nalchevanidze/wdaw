import * as React from 'react';
import { ENVELOPE_ID, EnvelopeConfig } from '@wdaw/engine';
import { usePreset } from './use-preset';

export const useEnvelope = () => {
  const [{ envelopes }, dispatch] = usePreset();

  const [id, setId] = React.useState<ENVELOPE_ID>('gain');

  const options = (Object.keys(envelopes) as ENVELOPE_ID[]).map((name) => ({
    name,
    active: name === id,
    onclick: () => setId(name)
  }));

  const setFields = (payload: Partial<EnvelopeConfig>) =>
    dispatch({ type: 'SET_ENVELOPE', id, payload });

  return { current: envelopes[id], id, options, setFields };
};
