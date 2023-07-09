import { AnnulusSector } from '@wdaw/svg';
import * as React from 'react';
import { circleFill } from '@wdaw/svg';
import { useWaveform } from '../utils/waveform-service';

type Props = {
  annulusSector: AnnulusSector;
  src: string;
};

const LevelWaveForm: React.FC<Props> = ({ src, annulusSector }) => (
  <path d={circleFill(useWaveform(src), annulusSector)} fillOpacity={0.8} />
);

export default LevelWaveForm;
