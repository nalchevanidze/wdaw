import { AnnulusSector } from "@wdaw/svg";
import * as React from "react";
import { circleFill } from "@wdaw/svg";
import { withWaveform } from "../utils/waveform-service";

export default withWaveform<{
  annulusSector: AnnulusSector;
}>(({ waveform, annulusSector }) => (
  <path d={circleFill(waveform, annulusSector)} fillOpacity={0.8} />
));
