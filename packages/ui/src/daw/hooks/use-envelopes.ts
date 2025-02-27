import * as React from 'react';
import { usePreset } from './use-preset';
import { ENVELOPE_ID } from '../../state/types';

export const useEnvelope = () => {
  const { envelopes, setEnvelope } = usePreset();

  const [id, setId] = React.useState<ENVELOPE_ID>('gain');

  const options = (Object.keys(envelopes) as ENVELOPE_ID[]).map((name) => ({
    name,
    active: name === id,
    onclick: () => setId(name)
  }));

  return { current: envelopes[id], id, options, setFields: setEnvelope(id) };
};
