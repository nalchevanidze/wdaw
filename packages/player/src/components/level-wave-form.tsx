import { AnnulusSector } from "@nalche/svg";
import * as React from "react";
import { circleFill } from "@nalche/svg";
import { withWaveform } from "../utils/waveform-service";

export default withWaveform<{
  annulusSector: AnnulusSector;
}>(({ waveform, annulusSector }) => (
  <path d={circleFill(waveform, annulusSector)} fillOpacity={0.8} />
));
