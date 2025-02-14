import * as React from 'react';
import { ENVELOPE_ID } from '@wdaw/engine';
import { usePreset } from './use-preset';

export const useEnvelope = () => {
  const [{ envelopes }, dispatch] = usePreset();

  const [id, setEnvelope] = React.useState<ENVELOPE_ID>('gain');
  const options = (Object.keys(envelopes) as ENVELOPE_ID[]).map((name) => ({
    name,
    active: name === id
  }));

  return [
    { current: envelopes[id], id, setEnvelope, options },
    dispatch
  ] as const;
};
