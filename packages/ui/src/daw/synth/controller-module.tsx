import * as React from 'react';
import { usePreset } from '../hooks/use-preset';
import { PANEL_ID } from '../../state/types';
import { Module } from '../../components/module';

type Props = {
  id: PANEL_ID;
  label: string;
  children: React.ReactNode;
  size?: number;
  optional?: boolean;
};

export const ControllerModule: React.FC<Props> = ({
  id,
  label,
  children,
  size = 1,
  optional
}) => {
  const { toggleModule, isModuleDisabled } = usePreset();

  return (
    <Module
      size={size}
      optional={optional}
      disabled={optional && isModuleDisabled(id)}
      label={label}
      onClick={id ? () => toggleModule(id) : undefined}
    >
      {children}
    </Module>
  );
};
